
export interface Document {
  id: string;
  user_id: string;
  name: string;
  type: string;
  url: string;
  size: number;
  created_at: string;
}

export interface CreateDocumentDto {
  user_id: string;
  name: string;
  type: string;
  url: string;
  size?: number;
}
