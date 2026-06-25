'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';

const BUCKET = 'case-documents';

export async function uploadDocument(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Not authenticated' };

  const caseId = String(formData.get('case_id') ?? '');
  const file = formData.get('file') as File | null;
  if (!caseId || !file || file.size === 0) return { error: 'A case and file are required.' };
  if (file.size > 25 * 1024 * 1024) return { error: 'File exceeds the 25 MB limit.' };

  const supabase = createClient();
  const safeName = file.name.replace(/[^\w.\-]/g, '_');
  const path = `${caseId}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (uploadError) return { error: uploadError.message };

  const { error: dbError } = await supabase.from('documents').insert({
    case_id: caseId,
    uploaded_by: user.id,
    name: file.name,
    storage_path: path,
    mime_type: file.type,
    size_bytes: file.size,
  });
  if (dbError) {
    // Roll back the orphaned object.
    await supabase.storage.from(BUCKET).remove([path]);
    return { error: dbError.message };
  }

  revalidatePath(`/cases/${caseId}`);
  revalidatePath('/documents');
  return { success: true };
}

/** Returns a short-lived signed URL for a private document. */
export async function getDocumentUrl(storagePath: string) {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, 60 * 5);
  if (error) return { error: error.message };
  return { url: data.signedUrl };
}

export async function deleteDocument(id: string, storagePath: string) {
  const supabase = createClient();
  await supabase.storage.from(BUCKET).remove([storagePath]);
  const { error } = await supabase.from('documents').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/documents');
  return { success: true };
}
