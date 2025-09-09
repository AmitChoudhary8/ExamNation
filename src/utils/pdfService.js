import { supabase } from './supabase';

// Get all PDFs
export const getPDFs = async () => {
  const { data, error } = await supabase
    .from('pdfs')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Get PDF by title
export const getPDFByTitle = async (title) => {
  const { data, error } = await supabase
    .from('pdfs')
    .select('*')
    .ilike('title', title)
    .single();
  
  if (error) throw error;
  return data;
};

// Create new PDF
export const createPDF = async (pdfData) => {
  const { data, error } = await supabase
    .from('pdfs')
    .insert([pdfData])
    .select();
  
  if (error) throw error;
  return data[0];
};

// Update PDF
export const updatePDF = async (id, pdfData) => {
  const { data, error } = await supabase
    .from('pdfs')
    .update({ ...pdfData, updated_at: new Date() })
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0];
};

// Delete PDF
export const deletePDF = async (id) => {
  const { error } = await supabase
    .from('pdfs')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Toggle bookmark
export const toggleBookmark = async (pdfId) => {
  const user = supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  
  const { data: existing, error: checkError } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', user.id)
    .eq('pdf_id', pdfId)
    .single();
  
  if (existing) {
    // Remove bookmark
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', existing.id);
    
    if (error) throw error;
    return false;
  } else {
    // Add bookmark
    const { error } = await supabase
      .from('bookmarks')
      .insert([{ user_id: user.id, pdf_id: pdfId }]);
    
    if (error) throw error;
    return true;
  }
};

// Rate PDF
export const ratePDF = async (pdfId, rating) => {
  const user = supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  
  // Insert or update rating
  const { error } = await supabase
    .from('ratings')
    .upsert([
      { user_id: user.id, pdf_id: pdfId, rating }
    ]);
  
  if (error) throw error;
  
  // Update PDF average rating
  await updatePDFRating(pdfId);
};

// Update PDF average rating
const updatePDFRating = async (pdfId) => {
  const { data, error } = await supabase
    .from('ratings')
    .select('rating')
    .eq('pdf_id', pdfId);
  
  if (error) throw error;
  
  const totalRatings = data.length;
  const averageRating = totalRatings > 0 
    ? data.reduce((sum, r) => sum + r.rating, 0) / totalRatings 
    : 0;
  
  await supabase
    .from('pdfs')
    .update({ 
      average_rating: averageRating,
      total_ratings: totalRatings 
    })
    .eq('id', pdfId);
};
