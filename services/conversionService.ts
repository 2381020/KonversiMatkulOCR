import { supabase } from './supabaseClient';
import type {
  ConversionRequest,
  ConversionDetail,
  StudyProgram,
  Curriculum,
  WorkflowApproval
} from '../types';

export const conversionService = {
  async getStudyPrograms(): Promise<StudyProgram[]> {
    const { data, error } = await supabase
      .from('study_programs')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async getCurriculum(studyProgramId: string): Promise<Curriculum[]> {
    const { data, error } = await supabase
      .from('curriculum')
      .select('*')
      .eq('study_program_id', studyProgramId)
      .eq('is_active', true)
      .order('semester, course_name');

    if (error) throw error;
    return data || [];
  },

  async createConversionRequest(request: {
    student_id: string;
    student_name: string;
    origin_university: string;
    origin_program: string;
    target_program_id: string;
    total_sks: number;
    ipk: number;
  }): Promise<ConversionRequest> {
    const requestNumber = `REQ-${Date.now().toString().slice(-8)}`;

    const { data, error } = await supabase
      .from('conversion_requests')
      .insert({
        ...request,
        request_number: requestNumber,
        current_stage: 'pending_student',
        final_status: 'draft'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async saveConversionDetails(details: Array<{
    request_id: string;
    origin_course_name: string;
    origin_sks: number;
    origin_grade_letter: string;
    origin_grade_number: number;
  }>): Promise<ConversionDetail[]> {
    const { data, error } = await supabase
      .from('conversion_details')
      .insert(details)
      .select();

    if (error) throw error;
    return data || [];
  },

  async getConversionRequest(id: string): Promise<ConversionRequest | null> {
    const { data, error } = await supabase
      .from('conversion_requests')
      .select(`
        *,
        target_program:study_programs(*)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getConversionDetails(requestId: string): Promise<ConversionDetail[]> {
    const { data, error } = await supabase
      .from('conversion_details')
      .select('*')
      .eq('request_id', requestId)
      .order('origin_course_name');

    if (error) throw error;
    return data || [];
  },

  async getStudentRequests(studentId: string): Promise<ConversionRequest[]> {
    const { data, error } = await supabase
      .from('conversion_requests')
      .select(`
        *,
        target_program:study_programs(*)
      `)
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getPendingRequestsForKaprodi(programId: string): Promise<ConversionRequest[]> {
    const { data, error } = await supabase
      .from('conversion_requests')
      .select(`
        *,
        target_program:study_programs(*)
      `)
      .eq('target_program_id', programId)
      .eq('current_stage', 'pending_kaprodi')
      .order('submitted_at');

    if (error) throw error;
    return data || [];
  },

  async getAllPendingRequests(stage: string): Promise<ConversionRequest[]> {
    const { data, error } = await supabase
      .from('conversion_requests')
      .select(`
        *,
        target_program:study_programs(*)
      `)
      .eq('current_stage', stage)
      .order('submitted_at');

    if (error) throw error;
    return data || [];
  },

  async updateConversionDetail(
    id: string,
    updates: Partial<ConversionDetail>
  ): Promise<ConversionDetail> {
    const { data, error } = await supabase
      .from('conversion_details')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateRequestStage(
    requestId: string,
    newStage: ConversionRequest['current_stage'],
    newStatus?: ConversionRequest['final_status']
  ): Promise<ConversionRequest> {
    const updates: any = {
      current_stage: newStage,
      updated_at: new Date().toISOString()
    };

    if (newStatus) {
      updates.final_status = newStatus;
    }

    if (newStage === 'pending_kaprodi' && newStatus === 'submitted') {
      updates.submitted_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('conversion_requests')
      .update(updates)
      .eq('id', requestId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async createApproval(approval: {
    request_id: string;
    stage: WorkflowApproval['stage'];
    approver_id: string;
    action: WorkflowApproval['action'];
    notes?: string;
  }): Promise<WorkflowApproval> {
    const { data, error } = await supabase
      .from('workflow_approvals')
      .insert(approval)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getApprovals(requestId: string): Promise<WorkflowApproval[]> {
    const { data, error } = await supabase
      .from('workflow_approvals')
      .select('*')
      .eq('request_id', requestId)
      .order('created_at');

    if (error) throw error;
    return data || [];
  },

  async updateRequestTotals(requestId: string, totalConvertedSks: number): Promise<void> {
    const { error } = await supabase
      .from('conversion_requests')
      .update({
        total_converted_sks: totalConvertedSks,
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId);

    if (error) throw error;
  }
};
