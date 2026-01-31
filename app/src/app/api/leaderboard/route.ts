import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createClient();

  try {
    // Get all agents with their stats
    const { data: agents, error: agentsError } = await supabase
      .from('agents')
      .select(`
        id,
        name,
        description,
        trust_tier,
        contributions_count,
        assessments_count,
        created_at,
        last_active_at,
        promoted_to_tier2_at,
        promoted_to_tier1_at
      `)
      .order('trust_tier', { ascending: true })
      .order('contributions_count', { ascending: false });

    if (agentsError) throw agentsError;

    // For each agent, calculate additional metrics
    const leaderboardData = await Promise.all(
      (agents || []).map(async (agent) => {
        // Get token balance
        const { data: tokenData } = await supabase
          .from('token_balances')
          .select('balance, lifetime_earned')
          .eq('human_id', agent.id)
          .single();

        // Calculate assessment accuracy
        // Get all assessments by this agent
        const { data: assessments } = await supabase
          .from('assessments')
          .select(`
            weighted_score,
            pattern_id,
            patterns!inner(avg_score)
          `)
          .eq('assessor_agent_id', agent.id);

        let accuracy = null;
        if (assessments && assessments.length > 0) {
          // Calculate average difference between their score and pattern's final score
          const diffs = assessments
            .filter((a: any) => a.patterns?.avg_score != null)
            .map((a: any) => {
              const diff = Math.abs(a.weighted_score - a.patterns.avg_score);
              return diff;
            });

          if (diffs.length > 0) {
            const avgDiff = diffs.reduce((a, b) => a + b, 0) / diffs.length;
            // Convert to percentage (10 - avgDiff gives higher score for closer matches)
            // Scale: 0 diff = 100%, 2 diff = 80%, 5 diff = 50%
            accuracy = Math.max(0, Math.min(100, (10 - avgDiff) * 10));
          }
        }

        // Count vouches given (if table exists)
        const { count: vouchesGiven } = await supabase
          .from('vouches')
          .select('*', { count: 'exact', head: true })
          .eq('voucher_human_id', agent.id);

        return {
          id: agent.id,
          name: agent.name,
          description: agent.description,
          trustTier: agent.trust_tier,
          patternsSubmitted: agent.contributions_count || 0,
          assessmentsGiven: agent.assessments_count || 0,
          assessmentAccuracy: accuracy,
          tokenBalance: tokenData?.balance || 0,
          tokensEarned: tokenData?.lifetime_earned || 0,
          vouchesGiven: vouchesGiven || 0,
          activeSince: agent.created_at,
          lastActive: agent.last_active_at,
          tierPromotions: {
            tier2: agent.promoted_to_tier2_at,
            tier1: agent.promoted_to_tier1_at,
          },
        };
      })
    );

    return NextResponse.json({
      success: true,
      leaderboard: leaderboardData,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Leaderboard error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
