export function createMockAdapter(profile){
  const calls = [];
  return {
    async trackPage(ctx){
      console.debug('[MOCK] trackPage', ctx);
      return { ok:true, ts: Date.now() };
    },
    async trackCall(ctx){
      const id = `CALL-${String(calls.length+1).padStart(4,'0')}`;
      const sentiments = ['Positive','Neutral','Negative'];
      const insightsList = ['Appointment booked','Price inquiry','Missed follow-up'];
      const rec = {
        id,
        ctx,
        sentiment: sentiments[calls.length % sentiments.length],
        insights: insightsList[calls.length % insightsList.length],
        durationSec: 180 + ((calls.length * 17) % 90),
        ts: Date.now()
      };
      calls.push(rec);
      return rec;
    },
    async getRecentCalls(){ return calls.slice(-10); }
  };
}
