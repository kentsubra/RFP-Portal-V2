import { useCallback } from 'react';
import { collection, doc, addDoc, updateDoc, deleteDoc, getDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { opportunityConverter, OPPORTUNITIES_COLLECTION } from '../converters/opportunity';
import { CreateOpportunity, OpportunityBase, OpportunityResponse, OpportunitiesResponse } from '@/types/opportunity';

/**
 * Hook for opportunity-related actions
 */
export function useOpportunityActions() {
  /**
   * Create a new opportunity
   */
  const createOpportunity = useCallback(async (data: CreateOpportunity): Promise<OpportunityResponse> => {
    try {
      // Reference to the opportunities collection with converter
      const opportunitiesRef = collection(db, OPPORTUNITIES_COLLECTION).withConverter(opportunityConverter);

      // Add timestamps
      const opportunityWithTimestamps = {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Add document to collection
      const docRef = await addDoc(opportunitiesRef, opportunityWithTimestamps);
      
      // Get the document to return it with the ID
      const opportunityDoc = await getDoc(doc(db, OPPORTUNITIES_COLLECTION, docRef.id).withConverter(opportunityConverter));
      const opportunity = opportunityDoc.data();

      return {
        success: true,
        data: opportunity,
      };
    } catch (error) {
      console.error('Error creating opportunity:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }, []);

  /**
   * Get a single opportunity by ID
   */
  const getOpportunity = useCallback(async (id: string): Promise<OpportunityResponse> => {
    try {
      const opportunityDoc = await getDoc(doc(db, OPPORTUNITIES_COLLECTION, id).withConverter(opportunityConverter));
      
      if (!opportunityDoc.exists()) {
        return {
          success: false,
          error: 'Opportunity not found',
        };
      }

      return {
        success: true,
        data: opportunityDoc.data(),
      };
    } catch (error) {
      console.error('Error getting opportunity:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }, []);

  /**
   * Get opportunities for the current user
   */
  const getUserOpportunities = useCallback(async (userId: string): Promise<OpportunitiesResponse> => {
    try {
      // Query opportunities belonging to the user
      const q = query(
        collection(db, OPPORTUNITIES_COLLECTION).withConverter(opportunityConverter),
        where('ownerUid', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const opportunities: OpportunityBase[] = [];

      querySnapshot.forEach(doc => {
        opportunities.push(doc.data());
      });

      return {
        success: true,
        data: opportunities,
      };
    } catch (error) {
      console.error('Error getting user opportunities:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }, []);

  /**
   * Update an opportunity
   */
  const updateOpportunity = useCallback(async (id: string, data: Partial<OpportunityBase>): Promise<OpportunityResponse> => {
    try {
      const opportunityRef = doc(db, OPPORTUNITIES_COLLECTION, id);
      
      // Add updated timestamp
      await updateDoc(opportunityRef, {
        ...data,
        updatedAt: new Date(),
      });

      // Get the updated document
      const updatedDoc = await getDoc(opportunityRef.withConverter(opportunityConverter));
      
      return {
        success: true,
        data: updatedDoc.data(),
      };
    } catch (error) {
      console.error('Error updating opportunity:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }, []);

  /**
   * Delete an opportunity
   */
  const deleteOpportunity = useCallback(async (id: string): Promise<OpportunityResponse> => {
    try {
      await deleteDoc(doc(db, OPPORTUNITIES_COLLECTION, id));
      
      return {
        success: true,
      };
    } catch (error) {
      console.error('Error deleting opportunity:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }, []);

  return {
    createOpportunity,
    getOpportunity,
    getUserOpportunities,
    updateOpportunity,
    deleteOpportunity,
  };
} 