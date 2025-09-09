import { supabase } from './supabase';

// Get all PDFs
export const getPDFs = async () => {
  try {
    const { data, error } = await supabase
      .from('pdfs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching PDFs:', error);
    return [];
  }
};

// Get PDF by title
export const getPDFByTitle = async (title) => {
  try {
    const { data, error } = await supabase
      .from('pdfs')
      .select('*')
      .ilike('title', `%${title}%`)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching PDF by title:', error);
    throw error;
  }
};

// ✅ Fixed Create PDF
export const createPDF = async (pdfData) => {
  try {
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
  } catch (error) {
    console.error('Error creating PDF:', error);
    throw error;
  }
};

// ✅ Fixed Update PDF - This was the main issue
export const updatePDF = async (id, pdfData) => {
  try {
    // ✅ Remove id from pdfData to avoid conflicts
    const { id: _, ...updateData } = pdfData;
    
    const { data, error } = await supabase
      .from('pdfs')
      .update({ 
        ...updateData, 
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Supabase update error:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      throw new Error('No data returned after update');
    }
    
    return data[0];
  } catch (error) {
    console.error('Error updating PDF:', error);
    throw error;
  }
};

// Delete PDF
export const deletePDF = async (id) => {
  try {
    const { error } = await supabase
      .from('pdfs')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting PDF:', error);
    throw error;
  }
};

// ✅ Fixed Authentication for bookmarks
export const toggleBookmark = async (pdfId, userId) => {
  if (!userId) throw new Error('User not authenticated');
  
  try {
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
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    throw error;
  }
};

// ✅ Fixed Authentication for ratings
export const ratePDF = async (pdfId, rating, userId) => {
  if (!userId) throw new Error('User not authenticated');
  
  try {
    // Check if user has already rated
    const { data: existingRating } = await supabase
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
  } catch (error) {
    console.error('Error rating PDF:', error);
    throw error;
  }
};

// Get user's rating for a PDF
export const getUserRating = async (pdfId, userId) => {
  if (!userId) return null;
  
  try {
    const { data, error } = await supabase
      .from('ratings')
      .select('rating')
      .eq('user_id', userId)
      .eq('pdf_id', pdfId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    console.error('Error getting user rating:', error);
    return null;
  }
};

// Update PDF average rating
const updatePDFRating = async (pdfId) => {
  try {
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
  } catch (error) {
    console.error('Error updating PDF rating:', error);
  }
};
