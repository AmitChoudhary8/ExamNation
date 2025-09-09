import { supabase } from './supabase';

// Get all PDFs
export const getPDFs = async () => {
  const { data, error } = await supabase
    .from('pdfs')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

// Get PDF by title
export const getPDFByTitle = async (title) => {
  const { data, error } = await supabase
    .from('pdfs')
    .select('*')
    .ilike('title', `%${title}%`)
    .single();
  
  if (error) throw error;
  return data;
};

// Create new PDF
export const createPDF = async (pdfData) => {
  const { data, error } = await supabase
    .from('pdfs')
    .insert([{
      ...pdfData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select();
  
  if (error) throw error;
  return data[0];
};

// Update PDF
export const updatePDF = async (id, pdfData) => {
  const { data, error } = await supabase
    .from('pdfs')
    .update({ 
      ...pdfData, 
      updated_at: new Date().toISOString()
    })
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

// ✅ Fixed toggle bookmark with proper authentication
export const toggleBookmark = async (pdfId, userId) => {
  if (!userId) throw new Error('User not authenticated');
  
  // Check if bookmark exists
  const { data: existing, error: checkError } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', userId)
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
      .insert([{ 
        user_id: userId, 
        pdf_id: pdfId,
        created_at: new Date().toISOString()
      }]);
    
    if (error) throw error;
    return true;
  }
};

// ✅ Fixed rate PDF with user authentication and duplicate prevention
export const ratePDF = async (pdfId, rating, userId) => {
  if (!userId) throw new Error('User not authenticated');
  
  // Check if user has already rated
  const { data: existingRating, error: checkError } = await supabase
    .from('ratings')
    .select('id')
    .eq('user_id', userId)
    .eq('pdf_id', pdfId)
    .single();
  
  if (existingRating) {
    throw new Error('You have already rated this PDF');
  }
  
  // Insert new rating
  const { error } = await supabase
    .from('ratings')
    .insert([{
      user_id: userId,
      pdf_id: pdfId,
      rating,
      created_at: new Date().toISOString()
    }]);
  
  if (error) throw error;
  
  // Update PDF average rating
  await updatePDFRating(pdfId);
};

// ✅ Get user's rating for a PDF
export const getUserRating = async (pdfId, userId) => {
  if (!userId) return null;
  
  const { data, error } = await supabase
    .from('ratings')
    .select('rating')
    .eq('user_id', userId)
    .eq('pdf_id', pdfId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
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
