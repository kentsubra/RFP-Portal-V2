import { 
  DocumentData, 
  FirestoreDataConverter, 
  QueryDocumentSnapshot,
  Timestamp,
  WithFieldValue 
} from 'firebase-admin/firestore';
import { Opportunity, OpportunityStatus, OpportunityPriority } from '@/types/opportunity';

// Helper function to convert Firestore Timestamps to Date objects
const convertTimestampToDate = (timestamp: Timestamp): Date => {
  return timestamp.toDate();
};

// Helper function to handle date conversions for Firestore
const convertDatesToTimestamps = (opportunity: Partial<Opportunity>) => {
  const result: Record<string, unknown> = { ...opportunity };
  
  // Convert Date objects to Firestore Timestamps
  if (opportunity.rfpDue instanceof Date) {
    result.rfpDue = Timestamp.fromDate(opportunity.rfpDue);
  }
  
  if (opportunity.internalDeadline instanceof Date) {
    result.internalDeadline = Timestamp.fromDate(opportunity.internalDeadline);
  }
  
  if (opportunity.createdAt instanceof Date) {
    result.createdAt = Timestamp.fromDate(opportunity.createdAt);
  }
  
  if (opportunity.updatedAt instanceof Date) {
    result.updatedAt = Timestamp.fromDate(opportunity.updatedAt);
  }
  
  return result;
};

// Firestore converter for Opportunity
export const opportunityConverter: FirestoreDataConverter<Opportunity> = {
  // Convert Firestore data to an Opportunity object
  fromFirestore(
    snapshot: QueryDocumentSnapshot
  ): Opportunity {
    const data = snapshot.data();
    
    return {
      id: snapshot.id,
      name: data.name,
      client: data.client,
      sbu: data.sbu,
      value: data.value,
      grossMargin: data.grossMargin,
      priority: data.priority as OpportunityPriority,
      status: data.status as OpportunityStatus,
      rfpDue: convertTimestampToDate(data.rfpDue),
      internalDeadline: convertTimestampToDate(data.internalDeadline),
      ownerUid: data.ownerUid,
      createdAt: data.createdAt ? convertTimestampToDate(data.createdAt) : undefined,
      updatedAt: data.updatedAt ? convertTimestampToDate(data.updatedAt) : undefined,
      assignedTo: data.assignedTo || [],
    };
  },
  
  // Convert an Opportunity object to Firestore data
  toFirestore(opportunity: WithFieldValue<Opportunity>): DocumentData {
    // Set timestamps for createdAt and updatedAt
    const now = new Date();
    
    const opportunityData: Record<string, unknown> = {
      ...opportunity,
      updatedAt: now,
    };
    
    // If this is a new document (no id), set createdAt
    if (!opportunity.id) {
      opportunityData.createdAt = now;
    }
    
    // Convert all dates to Firestore Timestamps
    return convertDatesToTimestamps(opportunityData);
  }
};

// Helper function to get the opportunities collection with converter applied
export const getOpportunitiesCollection = (db: FirebaseFirestore.Firestore) => {
  return db.collection('opportunities').withConverter(opportunityConverter);
}; 