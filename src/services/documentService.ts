
import { safeTableOperation } from '@/utils/safeTableUtil';
import { Document } from '@/types/document';

export interface CreateDocumentDto {
  user_id: string;
  name: string;
  type: string;
  url: string;
  size?: number;
}

export const documentService = {
  async createDocument(document: CreateDocumentDto): Promise<Document | null> {
    try {
      // @ts-ignore - Using safeTableOperation with dynamic table name
      const { data, error } = await safeTableOperation<Document>('documents')
        .insert(document)
        .select()
        .single();

      if (error) throw error;
      return data as Document;
    } catch (error) {
      console.error("Error creating document:", error);
      return null;
    }
  },

  async getUserDocuments(userId: string): Promise<Document[]> {
    try {
      // @ts-ignore - Using safeTableOperation with dynamic table name
      const { data, error } = await safeTableOperation<Document>('documents')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Document[];
    } catch (error) {
      console.error("Error getting user documents:", error);
      return [];
    }
  },

  async deleteDocument(id: string): Promise<boolean> {
    try {
      // @ts-ignore - Using safeTableOperation with dynamic table name
      const { error } = await safeTableOperation('documents')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting document:", error);
      return false;
    }
  }
};
