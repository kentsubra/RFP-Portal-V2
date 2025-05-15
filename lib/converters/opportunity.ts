import { FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, Timestamp } from 'firebase/firestore';
import { OpportunityBase, OpportunityDoc } from '@/types/opportunity';

// Firestore converter for Opportunity
export const opportunityConverter: FirestoreDataConverter<OpportunityBase> = {
  // Convert a Firestore document to an Opportunity object
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options?: SnapshotOptions
  ): OpportunityBase {
    const data = snapshot.data(options) as OpportunityDoc;
    
    return {
      id: snapshot.id,
      name: data.name,
      client: data.client,
      value: data.value,
      rfpDue: data.rfpDue instanceof Timestamp ? data.rfpDue.toDate() : data.rfpDue,
      internalDeadline: data.internalDeadline instanceof Timestamp 
        ? data.internalDeadline.toDate() 
        : data.internalDeadline,
      sbu: data.sbu,
      grossMargin: data.grossMargin,
      priority: data.priority,
      status: data.status,
      ownerUid: data.ownerUid,
      assignedTo: data.assignedTo,
      createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
      updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
    };
  },

  // Convert an Opportunity object to a Firestore document
  toFirestore(opportunity: OpportunityBase): OpportunityDoc {
    // Destructure ID but don't use it since Firestore manages document IDs separately
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...data } = opportunity;
    
    // Ensure dates are handled correctly
    return {
      ...data,
      createdAt: opportunity.createdAt || new Date(),
      updatedAt: new Date(),
    } as OpportunityDoc;
  }
};

// Collection name constant
export const OPPORTUNITIES_COLLECTION = 'opportunities'; 