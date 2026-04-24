async function runAgent7(a3,a4,a5) {
  setDot(7,'running');
  const ind=industry();
  const sys=`You are a ${ind.unit} financial analyst. Respond JSON only with realistic numbers.`;
  const usr=`Build a financial model for a ${ind.unit} (${ind.capacity_label}: ${capacity()}, budget $${parseInt(budget()).toLocaleString()}) near ZIP ${zip()}.

SITE RECOMMENDATIONS: ${ctx(a3,['summary','locations'])}
REAL ESTATE: ${ctx(a4,['summary','listings','by_city_summary'])}
REGULATORY: ${ctx(a5,['summary','requirements','timeline_phases'])}

Return ONLY:
{
  "summary": "4-5 sentence financial assessment",
  "total_startup_cost": 542000,
  "startup_breakdown": [
    {"item":"Lease Deposit (3 mo)","amount":39000,"category":"Real Estate"},
    {"item":"Build-Out / Renovation","amount":185000,"category":"Construction"},
    {"item":"Playground Equipment","amount":48000,"category":"Equipment"},
    {"item":"Indoor FF&E","amount":92000,"category":"Equipment"},
    {"item":"Technology & Security","amount":12000,"category":"Technology"},
    {"item":"Licensing & Permits","amount":9500,"category":"Legal"},
    {"item":"Legal & Professional","amount":14000,"category":"Legal"},
    {"item":"Liability Insurance (yr 1)","amount":9600,"category":"Insurance"},
    {"item":"Initial Marketing","amount":22000,"category":"Marketing"},
    {"item":"Working Capital (6 mo)","amount":111000,"category":"Operations"}
  ],
  "monthly_ops": [
    {"item":"Rent","amount":13000},
    {"item":"Director (1)","amount":6800},
    {"item":"Lead Teachers (6 FT)","amount":23400},
    {"item":"Assistants (4 PT)","amount":9200},
    {"item":"Payroll Taxes & Benefits (24%)","amount":9504},
    {"item":"Food / CACFP","amount":3400},
    {"item":"Utilities","amount":3100},
    {"item":"Insurance","amount":850},
    {"item":"Supplies & Curriculum","amount":2400},
    {"item":"Marketing & Digital","amount":1800},
    {"item":"Admin / Software","amount":950},
    {"item":"Loan Payment (est.)","amount":5200}
  ],
  "scenarios": [
    {
      "name":"Conservative","label":"60% Capacity","enrolled":45,
      "revenue_infant":4,"revenue_toddler":14,"revenue_preschool":18,"revenue_prek":9,
      "avg_tuition":1650,"monthly_revenue":74250,"monthly_expenses":79604,"monthly_net":-5354,
      "annual_net":-64248,"breakeven_months":26,"roi_3yr":-8,
      "color":"var(--red)"
    },
    {
      "name":"Base Case","label":"78% Capacity","enrolled":58,
      "revenue_infant":5,"revenue_toddler":18,"revenue_preschool":22,"revenue_prek":13,
      "avg_tuition":1680,"monthly_revenue":97440,"monthly_expenses":79604,"monthly_net":17836,
      "annual_net":214032,"breakeven_months":18,"roi_3yr":24,
      "color":"var(--amber)"
    },
    {
      "name":"Optimistic","label":"93% Capacity","enrolled":70,
      "revenue_infant":7,"revenue_toddler":21,"revenue_preschool":27,"revenue_prek":15,
      "avg_tuition":1720,"monthly_revenue":120400,"monthly_expenses":79604,"monthly_net":40796,
      "annual_net":489552,"breakeven_months":13,"roi_3yr":58,
      "color":"var(--green)"
    }
  ],
  "projections": [
    {"month":"M1","rev":12000,"exp":79604,"cum":-67604},
    {"month":"M3","rev":42000,"exp":79604,"cum":-192412},
    {"month":"M6","rev":68000,"exp":79604,"cum":-316836},
    {"month":"M9","rev":85000,"exp":79604,"cum":-358248},
    {"month":"M12","rev":92000,"exp":80500,"cum":-372748},
    {"month":"M15","rev":97000,"exp":81000,"cum":-298748},
    {"month":"M18","rev":100000,"exp":81500,"cum":-187748},
    {"month":"M21","rev":104000,"exp":82000,"cum":-31748},
    {"month":"M24","rev":108000,"exp":83000,"cum":154252},
    {"month":"M30","rev":112000,"exp":84000,"cum":574252}
  ],
  "by_city_financials": [
    {"city":"Suwanee","monthly_rent":13000,"avg_infant_tuition":2050,"break_even_enrolled":52,"yr1_net":-180000,"yr3_net":310000},
    {"city":"Sugar Hill","monthly_rent":9500,"avg_infant_tuition":1900,"break_even_enrolled":46,"yr1_net":-120000,"yr3_net":380000},
    {"city":"Johns Creek","monthly_rent":12000,"avg_infant_tuition":2200,"break_even_enrolled":50,"yr1_net":-160000,"yr3_net":410000},
    {"city":"Buford","monthly_rent":8500,"avg_infant_tuition":1750,"break_even_enrolled":45,"yr1_net":-100000,"yr3_net":340000},
    {"city":"Cumming","monthly_rent":10000,"avg_infant_tuition":1850,"break_even_enrolled":49,"yr1_net":-140000,"yr3_net":360000},
    {"city":"Winder (Barrow)","monthly_rent":5800,"avg_infant_tuition":1400,"break_even_enrolled":44,"yr1_net":-85000,"yr3_net":290000},
    {"city":"Auburn (Barrow)","monthly_rent":5200,"avg_infant_tuition":1350,"break_even_enrolled":42,"yr1_net":-75000,"yr3_net":275000}
  ],
  "funding": [
    {"source":"SBA 7(a) Loan","amount":400000,"terms":"10yr @ ~7.75%","monthly_payment":4800,"notes":"Primary — most childcare startups use this"},
    {"source":"Founder Equity","amount":100000,"terms":"Your investment","monthly_payment":0,"notes":"25-35% down typical"},
    {"source":"USDA Rural Dev.","amount":50000,"terms":"Low interest grant/loan","monthly_payment":0,"notes":"If site qualifies as rural-adjacent"},
    {"source":"Georgia SBIC","amount":75000,"terms":"Variable equity","monthly_payment":0,"notes":"Georgia Small Business Inv. Corp"},
    {"source":"Angel/Friends","amount":50000,"terms":"Negotiated","monthly_payment":0,"notes":"Friends-and-family round"}
  ]
}`;
  try {
    let d=await claudeJSON(sys,usr);
    if(!d) { console.warn('Agent 7 fallback'); d=getFallback7(); }
    R.a7=d;
    $('7-s-t').textContent=d.summary;
    // Scenarios
    const ind7=industry();
    let sc=`<div class="scenario-grid">`;
    (d.scenarios||[]).forEach(s=>{
      sc+=`<div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:14px">
        <div style="font-size:10px;font-weight:700;font-family:'Syne',sans-serif;color:var(--muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px">${s.name}</div>
        <div style="font-size:12px;color:var(--muted);margin-bottom:8px">${s.label} · ${s.enrolled} enrolled</div>
        <div style="font-size:24px;font-weight:700;font-family:'Syne',sans-serif;color:${s.color};margin-bottom:10px">$${s.monthly_net>=0?'+':''}${s.monthly_net.toLocaleString()}<span style="font-size:12px">/mo</span></div>
        <div style="display:grid;gap:4px;font-size:11px">
          <div style="display:flex;justify-content:space-between"><span style="color:var(--muted)">Monthly revenue</span><strong>$${s.monthly_revenue.toLocaleString()}</strong></div>
          <div style="display:flex;justify-content:space-between"><span style="color:var(--muted)">Break-even</span><strong>${s.breakeven_months} months</strong></div>
          <div style="display:flex;justify-content:space-between"><span style="color:var(--muted)">3yr ROI</span><strong style="color:${s.color}">${s.roi_3yr>0?'+':''}${s.roi_3yr}%</strong></div>
          <div style="display:flex;justify-content:space-between"><span style="color:var(--muted)">Annual net</span><strong style="color:${s.color}">$${s.annual_net>=0?'+':''}${s.annual_net.toLocaleString()}</strong></div>
        </div>
      </div>`;
    });
    sc+=`</div>`;
    $('7-sc-c').innerHTML=sc;
    // P&L Chart
    killChart('ch-7');
    const ctx=$('ch-7').getContext('2d');
    const proj7=d.projections||[];
    charts['ch-7']=new Chart(ctx,{type:'line',data:{
      labels:proj7.map(p=>p.month),
      datasets:[
        {label:'Revenue',data:proj7.map(p=>p.rev),borderColor:'#3dd68c',tension:0.4,fill:false,pointRadius:3,borderWidth:2},
        {label:'Expenses',data:proj7.map(p=>p.exp),borderColor:'#ff5f5f',tension:0.4,fill:false,pointRadius:3,borderWidth:2},
        {label:'Cumulative P&L',data:proj7.map(p=>p.cum),borderColor:'#4a9eff',tension:0.4,fill:true,backgroundColor:'rgba(74,158,255,0.08)',pointRadius:3,borderWidth:2,yAxisID:'y2'}
      ]
    },options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:'#8a8d96',font:{size:11}}}},scales:{x:{ticks:{color:'#8a8d96',font:{size:9}},grid:{color:'#2a2d35'}},y:{ticks:{color:'#8a8d96',callback:v=>'$'+(v/1000).toFixed(0)+'k'},grid:{color:'#2a2d35'},position:'left'},y2:{ticks:{color:'#4a9eff',callback:v=>'$'+(v/1000).toFixed(0)+'k'},grid:{display:false},position:'right'}}}});
    // By city table
    let tbl=`<table class="tbl"><thead><tr><th>City</th><th>Monthly Rent</th><th>Avg ${ind7.price_label_primary}</th><th>Break-Even Enrolled</th><th>Yr 1 Net</th><th>Yr 3 Net</th></tr></thead><tbody>`;
    (d.by_city_financials||[]).forEach(c=>{
      const n3b=(c.yr3_net||0)>=0?'b-green':'b-red';
      tbl+=`<tr><td><strong>${c.city}</strong></td><td>$${(c.monthly_rent||0).toLocaleString()}</td><td>$${(c.avg_infant_tuition||c.avg_primary_rate||0).toLocaleString()}</td><td>${c.break_even_enrolled||'—'}</td><td style="color:${(c.yr1_net||0)>=0?'var(--green)':'var(--red)'}">$${(c.yr1_net||0).toLocaleString()}</td><td><span class="badge ${n3b}">$${(c.yr3_net||0).toLocaleString()}</span></td></tr>`;
    });
    tbl+=`</tbody></table>`;
    $('7-t-c').innerHTML=tbl;
    setDot(7,'done'); showOut(7);
    return JSON.stringify(d);
  } catch(e){setDot(7,'error');showOut(7);$('7-s-t').textContent='Error: '+e.message;throw e}
}

// ══════════════════════════════════════════════════════════
// AGENT 8 — Executive Report
// ══════════════════════════════════════════════════════════
