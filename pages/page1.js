// Page 1: Overview Dashboard (from fixed_overview_dashboard)
function renderPage1(container) {
  let currentTab = 0;

  function kpis() {
    return `<div class="kpis">
      <div class="kpi">
        <div class="kpi-l">Attrition Rate</div>
        <div class="kpi-v" style="color:#A32D2D">14.76%</div>
        <div class="kpi-s">1,476 คน จาก 10,000</div>
      </div>
      <div class="kpi">
        <div class="kpi-l">High Risk</div>
        <div class="kpi-v" style="color:#633806">287 คน</div>
        <div class="kpi-s">Risk Score &gt; 70%</div>
      </div>
      <div class="kpi">
        <div class="kpi-l">กลุ่มเสี่ยงสูงสุด</div>
        <div class="kpi-v" style="color:#A32D2D">133 คน</div>
        <div class="kpi-s">OT + เงินเดือน &lt;3K</div>
      </div>
      <div class="kpi">
        <div class="kpi-l">Class Imbalance</div>
        <div class="kpi-v" style="color:var(--color-text-primary)">85:15</div>
        <div class="kpi-s">ไม่ลาออก vs ลาออก</div>
      </div>
    </div>`;
  }

  function tab0() {
    return kpis() + `
    <div class="row2">
      <div class="card">
        <div class="card-t">Attrition Rate แยก Job Role</div>
        ${[['Sales Rep',79,'#A32D2D','23.5%'],['HR',68,'#A32D2D','20.4%'],['Lab Tech',63,'#633806','18.8%'],['Research Sci',56,'#633806','16.8%'],['Sales Exec',53,'#633806','15.9%'],['Manager',40,'#27500A','12.1%'],['Mfg Director',37,'#27500A','11.1%']].map(([l,p,c,v])=>`
        <div class="bar-r">
          <div class="bar-lb">${l}</div>
          <div class="bar-tr"><div class="bar-f" style="width:${p}%;background:${c}"></div></div>
          <div class="bar-vl" style="color:${c}">${v}</div>
        </div>`).join('')}
      </div>
      <div class="card">
        <div class="card-t">Top 5 พนักงานเสี่ยงสูง</div>
        <table class="tbl">
          <thead><tr><th style="width:32%">ชื่อ</th><th style="width:22%">แผนก</th><th style="width:28%">Risk Score</th><th style="width:18%">ระดับ</th></tr></thead>
          <tbody>
            ${[['พนักงาน A','Sales',91,'#A32D2D','bh'],['พนักงาน B','R&D',84,'#A32D2D','bh'],['พนักงาน C','HR',79,'#A32D2D','bh'],['พนักงาน D','R&D',65,'#633806','bm'],['พนักงาน E','Sales',61,'#633806','bm']].map(([n,d,s,c,b])=>`
            <tr>
              <td style="font-weight:500">${n}</td><td>${d}</td>
              <td><div class="risk-bar"><div class="risk-tr"><div class="risk-f" style="width:${s}%;background:${c}"></div></div><span style="font-size:13px;font-weight:600;color:${c};min-width:28px">${s}%</span></div></td>
              <td><span class="badge ${b}">${b==='bh'?'High':'Medium'}</span></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
    <div class="card">
      <div class="card-t">Attrition Rate แยก Department × OverTime</div>
      <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:6px">
        ${[['Sales','12.0%','24.0%'],['R&D','10.6%','22.2%'],['HR','12.7%','22.2%']].map(([dept,no,ot])=>`
        <div style="text-align:center">
          <div style="font-size:14px;color:var(--color-text-secondary);margin-bottom:8px">${dept}</div>
          <div style="display:flex;gap:10px;justify-content:center">
            <div style="text-align:center">
              <div style="width:32px;height:48px;background:var(--color-background-secondary);border:1px solid var(--color-border-tertiary);border-radius:4px;display:flex;align-items:flex-end;overflow:hidden;margin:0 auto">
                <div style="width:100%;height:${parseFloat(no)/28*100}%;background:#27500A"></div>
              </div>
              <div style="font-size:12px;color:var(--color-text-secondary);margin-top:3px">ไม่ OT</div>
              <div style="font-size:14px;font-weight:600;color:#27500A">${no}</div>
            </div>
            <div style="text-align:center">
              <div style="width:32px;height:48px;background:var(--color-background-secondary);border:1px solid var(--color-border-tertiary);border-radius:4px;display:flex;align-items:flex-end;overflow:hidden;margin:0 auto">
                <div style="width:100%;height:${parseFloat(ot)/28*100}%;background:#A32D2D"></div>
              </div>
              <div style="font-size:12px;color:var(--color-text-secondary);margin-top:3px">OT</div>
              <div style="font-size:14px;font-weight:600;color:#A32D2D">${ot}</div>
            </div>
          </div>
        </div>`).join('')}
      </div>
    </div>
    <div style="font-size:15px;font-weight:600;color:var(--color-text-primary);margin-top:16px;margin-bottom:10px;padding-top:14px;border-top:1px solid var(--color-border-tertiary)">เปรียบเทียบ 3 Department</div>
    ${[{name:'Sales',total:3200,attrition:16.4,high:124,ot:38.5,avgIncome:5200,topRole:'Sales Rep (23.5%)',color:'#A32D2D'},
       {name:'R&D',total:5800,attrition:13.2,high:128,ot:28.1,avgIncome:7400,topRole:'Lab Tech (18.8%)',color:'#412402'},
       {name:'HR',total:1000,attrition:15.8,high:35,ot:31.2,avgIncome:4800,topRole:'HR Specialist (20.4%)',color:'#412402'}].map(d=>`
    <div class="dept-card">
      <div class="dept-header">
        <div class="dept-title">${d.name}</div>
        <div class="dept-rate" style="color:${d.color}">${d.attrition.toFixed(1)}% Attrition Rate</div>
      </div>
      <div class="dept-bar-wrap">
        <div class="dept-bar" style="width:${d.attrition/25*100}%;background:${d.color}"></div>
      </div>
      <div class="dept-grid">
        <div class="dept-stat">
          <div class="dept-stat-v">${d.total.toLocaleString()} คน</div>
          <div class="dept-stat-l">จำนวนพนักงาน</div>
        </div>
        <div class="dept-stat">
          <div class="dept-stat-v" style="color:#791F1F">${d.high} คน</div>
          <div class="dept-stat-l">High Risk</div>
        </div>
        <div class="dept-stat">
          <div class="dept-stat-v" style="color:#412402">${d.ot.toFixed(1)}%</div>
          <div class="dept-stat-l">ทำ OT</div>
        </div>
        <div class="dept-stat">
          <div class="dept-stat-v">${d.avgIncome.toLocaleString()}</div>
          <div class="dept-stat-l">เงินเดือนเฉลี่ย</div>
        </div>
        <div class="dept-stat" style="grid-column:span 2">
          <div class="dept-stat-v" style="font-size:14px">${d.topRole}</div>
          <div class="dept-stat-l">Job Role เสี่ยงสูงสุด</div>
        </div>
      </div>
    </div>`).join('')}`;
  }

  function tab1() {
    const groups = [
      {title:'OT + เงินเดือน < 3,000',count:133,pct:51.9,color:'#791F1F',bg:'#FCEBEB',border:'#F7C1C1',tags:['Sales Rep 48 คน','Lab Tech 35 คน','Research Sci 28 คน','HR 22 คน'],action:'ทบทวนเงินเดือนและนโยบาย OT ทันที'},
      {title:'อายุ ≤ 25 ปี + ทำ OT',count:89,pct:31.2,color:'#412402',bg:'#FAEEDA',border:'#FAC775',tags:['Sales Rep 32 คน','Lab Tech 27 คน','Research Sci 18 คน','HR 12 คน'],action:'Career Path และ Mentoring สำหรับกลุ่มเริ่มต้น'},
      {title:'ไม่ได้โปรโมท 6-7 ปี',count:65,pct:19.5,color:'#412402',bg:'#FAEEDA',border:'#FAC775',tags:['Manager 18 คน','Sales Exec 21 คน','Research Sci 15 คน','Lab Tech 11 คน'],action:'ทบทวน IDP และ Promotion Cycle'},
      {title:'Single + OT + Level 1',count:42,pct:31.4,color:'#791F1F',bg:'#FCEBEB',border:'#F7C1C1',tags:['Sales Rep 19 คน','Lab Tech 14 คน','Research Sci 9 คน'],action:'กลุ่มเสี่ยงสูงสุด Combo 3 ปัจจัย'},
    ];
    return kpis() + `
    <div style="font-size:14px;color:var(--color-text-secondary);margin-bottom:10px">พนักงาน 287 คน แบ่งตามปัจจัยเสี่ยงหลัก — เรียงจากเร่งด่วนมากสุด</div>
    ${groups.map(g=>`
    <div class="dept-card" style="background:${g.bg};border-color:${g.border}">
      <div class="dept-header">
        <div class="dept-title" style="color:${g.color}">${g.title}</div>
        <div style="display:flex;align-items:center;gap:6px">
          <span style="font-size:14px;color:${g.color};font-weight:500">${g.pct}%</span>
          <span class="badge" style="background:rgba(255,255,255,0.5);color:${g.color};border:1px solid ${g.border}">${g.count} คน</span>
        </div>
      </div>
      <div class="dept-bar-wrap"><div class="dept-bar" style="width:${g.pct/60*100}%;background:${g.color}"></div></div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">
        ${g.tags.map(t=>`<span style="font-size:13px;padding:3px 10px;border-radius:10px;background:rgba(255,255,255,0.6);color:${g.color};border:1px solid ${g.border}">${t}</span>`).join('')}
      </div>
      <div style="font-size:14px;color:${g.color};padding:6px 10px;background:rgba(255,255,255,0.5);border-radius:6px">
        HR Action: ${g.action}
      </div>
    </div>`).join('')}`;
  }

  function tab2() {
    return `<div style="padding:1rem 0;">
    <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:1.5rem;">
      <div style="background:var(--color-background-secondary);border-radius:var(--border-radius-md);padding:1rem;text-align:center;">
        <div style="font-size:13px;color:var(--color-text-secondary);margin-bottom:4px;">พนักงานทั้งหมด</div>
        <div style="font-size:28px;font-weight:500;color:var(--color-text-primary);">28</div>
        <div style="font-size:12px;color:var(--color-text-tertiary);">คน</div>
      </div>
      <div style="background:var(--color-background-secondary);border-radius:var(--border-radius-md);padding:1rem;text-align:center;">
        <div style="font-size:13px;color:var(--color-text-secondary);margin-bottom:4px;">รวม records เข้างาน</div>
        <div style="font-size:28px;font-weight:500;color:var(--color-text-primary);">6,634</div>
        <div style="font-size:12px;color:var(--color-text-tertiary);">วัน</div>
      </div>
      <div style="background:var(--color-background-secondary);border-radius:var(--border-radius-md);padding:1rem;text-align:center;">
        <div style="font-size:13px;color:var(--color-text-secondary);margin-bottom:4px;">รวมการลา</div>
        <div style="font-size:28px;font-weight:500;color:var(--color-text-primary);">127</div>
        <div style="font-size:12px;color:var(--color-text-tertiary);">ครั้ง</div>
      </div>
      <div style="background:var(--color-background-secondary);border-radius:var(--border-radius-md);padding:1rem;text-align:center;">
        <div style="font-size:13px;color:var(--color-text-secondary);margin-bottom:4px;">รวม OT approved</div>
        <div style="font-size:28px;font-weight:500;color:var(--color-text-primary);">26</div>
        <div style="font-size:12px;color:var(--color-text-tertiary);">ครั้ง</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:1.5rem;">
      <div style="background:var(--color-background-primary);border:0.5px solid var(--color-border-tertiary);border-radius:var(--border-radius-lg);padding:1rem 1.25rem;">
        <div style="font-size:14px;font-weight:500;color:var(--color-text-secondary);margin-bottom:12px;">พนักงานแยกตามแผนก</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;font-size:12px;color:var(--color-text-secondary);">
          <span style="display:flex;align-items:center;gap:4px;"><span style="width:10px;height:10px;border-radius:2px;background:#534AB7;"></span>Development (11)</span>
          <span style="display:flex;align-items:center;gap:4px;"><span style="width:10px;height:10px;border-radius:2px;background:#1D9E75;"></span>Management (8)</span>
          <span style="display:flex;align-items:center;gap:4px;"><span style="width:10px;height:10px;border-radius:2px;background:#888780;"></span>Outsource (8)</span>
          <span style="display:flex;align-items:center;gap:4px;"><span style="width:10px;height:10px;border-radius:2px;background:#D85A30;"></span>Executive (1)</span>
        </div>
        <div style="position:relative;width:100%;height:200px;"><canvas id="eda-deptChart"></canvas></div>
      </div>
      <div style="background:var(--color-background-primary);border:0.5px solid var(--color-border-tertiary);border-radius:var(--border-radius-lg);padding:1rem 1.25rem;">
        <div style="font-size:14px;font-weight:500;color:var(--color-text-secondary);margin-bottom:12px;">พนักงานแยกตามตำแหน่ง</div>
        <div style="position:relative;width:100%;height:220px;"><canvas id="eda-jobChart"></canvas></div>
      </div>
    </div>
    <div style="background:var(--color-background-primary);border:0.5px solid var(--color-border-tertiary);border-radius:var(--border-radius-lg);padding:1rem 1.25rem;margin-bottom:1.5rem;">
      <div style="font-size:14px;font-weight:500;color:var(--color-text-secondary);margin-bottom:12px;">แนวโน้มการเข้างานรายเดือน (2023–2026)</div>
      <div style="position:relative;width:100%;height:220px;"><canvas id="eda-attendChart"></canvas></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:1.5rem;">
      <div style="background:var(--color-background-primary);border:0.5px solid var(--color-border-tertiary);border-radius:var(--border-radius-lg);padding:1rem 1.25rem;">
        <div style="font-size:14px;font-weight:500;color:var(--color-text-secondary);margin-bottom:12px;">Top 5 ลาบ่อยสุด (ครั้ง)</div>
        <div style="position:relative;width:100%;height:200px;"><canvas id="eda-leaveChart"></canvas></div>
      </div>
      <div style="background:var(--color-background-primary);border:0.5px solid var(--color-border-tertiary);border-radius:var(--border-radius-lg);padding:1rem 1.25rem;">
        <div style="font-size:14px;font-weight:500;color:var(--color-text-secondary);margin-bottom:12px;">OT approved รายคน</div>
        <div style="position:relative;width:100%;height:200px;"><canvas id="eda-otChart"></canvas></div>
      </div>
    </div>
    <div style="background:var(--color-background-primary);border:0.5px solid var(--color-border-tertiary);border-radius:var(--border-radius-lg);padding:1rem 1.25rem;margin-bottom:1.5rem;">
      <div style="font-size:14px;font-weight:500;color:var(--color-text-secondary);margin-bottom:12px;">เฉลี่ยชั่วโมงทำงาน/วัน</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px;font-size:12px;color:var(--color-text-secondary);">
        <span style="display:flex;align-items:center;gap:4px;"><span style="width:10px;height:10px;border-radius:2px;background:#E24B4A;"></span>สูง ≥8.0 ชม.</span>
        <span style="display:flex;align-items:center;gap:4px;"><span style="width:10px;height:10px;border-radius:2px;background:#BA7517;"></span>ปานกลาง 7.7–7.9</span>
        <span style="display:flex;align-items:center;gap:4px;"><span style="width:10px;height:10px;border-radius:2px;background:#1D9E75;"></span>ปกติ &lt;7.7</span>
      </div>
      <div style="position:relative;width:100%;height:300px;"><canvas id="eda-hoursChart"></canvas></div>
    </div>
    <div style="background:var(--color-background-primary);border:0.5px solid var(--color-border-tertiary);border-radius:var(--border-radius-lg);padding:1rem 1.25rem;">
      <div style="font-size:14px;font-weight:500;color:var(--color-text-secondary);margin-bottom:12px;">ความเสี่ยงลาออก (Retention Risk Score)</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px;font-size:12px;color:var(--color-text-secondary);">
        <span style="display:flex;align-items:center;gap:4px;"><span style="width:10px;height:10px;border-radius:2px;background:#E24B4A;"></span>เสี่ยงสูง ≥80</span>
        <span style="display:flex;align-items:center;gap:4px;"><span style="width:10px;height:10px;border-radius:2px;background:#BA7517;"></span>เสี่ยงปานกลาง 60–79</span>
        <span style="display:flex;align-items:center;gap:4px;"><span style="width:10px;height:10px;border-radius:2px;background:#1D9E75;"></span>เสี่ยงต่ำ &lt;60</span>
      </div>
      <div style="position:relative;width:100%;height:240px;"><canvas id="eda-riskChart"></canvas></div>
    </div>
    </div>`;
  }

  function initPage1Charts() {
    var isDk = window.matchMedia('(prefers-color-scheme:dark)').matches || document.documentElement.getAttribute('data-theme') !== 'light';
    var tc = isDk ? '#ccc' : '#555';
    var gc = isDk ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

    new Chart(document.getElementById('eda-deptChart'),{type:'doughnut',data:{labels:['Development (11)','Management (8)','Outsource (8)','Executive (1)'],datasets:[{data:[11,8,8,1],backgroundColor:['#534AB7','#1D9E75','#888780','#D85A30'],borderWidth:0}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}}}});

    new Chart(document.getElementById('eda-jobChart'),{type:'bar',data:{labels:['System Analyst','Senior Prog.','Intern Prog.','Junior Prog.','Tester','Others'],datasets:[{data:[4,3,3,2,2,4],backgroundColor:'#534AB7',borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,indexAxis:'y',plugins:{legend:{display:false}},scales:{x:{grid:{color:gc},ticks:{color:tc}},y:{grid:{display:false},ticks:{color:tc,font:{size:11}}}}}});

    var months=['2023-05','2023-08','2023-11','2024-02','2024-05','2024-08','2024-11','2025-02','2025-05','2025-08','2025-11','2026-02','2026-05'];
    var attendData=[145,158,157,132,139,126,138,139,219,246,260,293,83];
    new Chart(document.getElementById('eda-attendChart'),{type:'line',data:{labels:months,datasets:[{label:'records',data:attendData,borderColor:'#534AB7',backgroundColor:'rgba(83,74,183,0.1)',fill:true,tension:0.4,pointRadius:3}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{color:gc},ticks:{color:tc,maxRotation:45}},y:{grid:{color:gc},ticks:{color:tc}}}}});

    new Chart(document.getElementById('eda-leaveChart'),{type:'bar',data:{labels:['ID-2','ID-10','ID-11','ID-1','ID-8'],datasets:[{data:[18,16,15,12,11],backgroundColor:['#E24B4A','#E24B4A','#E24B4A','#BA7517','#BA7517'],borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{color:tc}},y:{grid:{color:gc},ticks:{color:tc}}}}});

    new Chart(document.getElementById('eda-otChart'),{type:'bar',data:{labels:['ID-22','ID-14','ID-25','ID-8','ID-26'],datasets:[{data:[9,6,6,3,2],backgroundColor:['#D85A30','#D85A30','#D85A30','#BA7517','#BA7517'],borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{color:tc}},y:{grid:{color:gc},ticks:{color:tc}}}}});

    var empIDs=['ID-18','ID-19','ID-2','ID-1','ID-16','ID-10','ID-12','ID-17','ID-11','ID-8','ID-22','ID-6','ID-14','ID-28'];
    var empHours=[7.88,7.33,7.75,7.60,7.40,6.94,7.61,8.26,8.18,7.55,7.88,6.69,7.65,8.07];
    var hc=empHours.map(function(h){return h>=8.0?'#E24B4A':h>=7.7?'#BA7517':'#1D9E75';});
    new Chart(document.getElementById('eda-hoursChart'),{type:'bar',data:{labels:empIDs,datasets:[{data:empHours,backgroundColor:hc,borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{color:tc,font:{size:11},maxRotation:45,autoSkip:false}},y:{grid:{color:gc},ticks:{color:tc},min:6,max:9,title:{display:true,text:'ชม./วัน',color:tc}}}}});

    var riskIDs=['ID-11','ID-8','ID-22','ID-14','ID-2','ID-1','ID-10'];
    var riskScores=[90,85,80,65,60,50,45];
    var rc=riskScores.map(function(s){return s>=80?'#E24B4A':s>=60?'#BA7517':'#1D9E75';});
    new Chart(document.getElementById('eda-riskChart'),{type:'bar',data:{labels:riskIDs,datasets:[{label:'Risk Score',data:riskScores,backgroundColor:rc,borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{color:tc}},y:{grid:{color:gc},ticks:{color:tc},min:0,max:100,title:{display:true,text:'คะแนน (0-100)',color:tc}}}}});
  }

  function render() {
    var body = container.querySelector('.body');
    var dsInfo = container.querySelector('#p1-dataset-info');
    if (currentTab === 0) { 
      body.innerHTML = tab2(); 
      initPage1Charts(); 
      if(dsInfo) dsInfo.textContent = 'ข้อมูลจากระบบ HRM';
    }
    else if (currentTab === 1) {
      body.innerHTML = tab0();
      if(dsInfo) dsInfo.textContent = 'วิเคราะห์จากฐานข้อมูลพยากรณ์ 10,000 รายการ';
    }
    else if (currentTab === 2) {
      body.innerHTML = tab1();
      if(dsInfo) dsInfo.textContent = 'วิเคราะห์จากฐานข้อมูลพยากรณ์ 10,000 รายการ';
    }
  }

  container.innerHTML = `
    <div class="topbar">
      <div class="tb-title">Overview Dashboard</div>
      <div class="tb-r">
        ${themeToggleHTML()}
        <select class="sel" id="dept-filter">
          <option value="all">ทุก Department</option>
          <option value="sales">Sales</option>
          <option value="rd">R&D</option>
          <option value="hr">HR</option>
        </select>
        <button class="btn-e" id="btn-pdf" style="display:flex;align-items:center;gap:6px">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v8M7 9L4 6M7 9l3-3" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 10v2a1 1 0 001 1h10a1 1 0 001-1v-2" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Download PDF Report
        </button>
      </div>
    </div>
    <div class="tabs">
      <div class="tab on" id="p1-tab-0">Snapshot</div>
      <div class="tab" id="p1-tab-1">Global Trends</div>
      <div class="tab" id="p1-tab-2">Risk Archetypes</div>
    </div>
    <div class="body"></div>
    <div class="legend">
      <div class="leg-i"><div class="leg-d" style="background:#A32D2D"></div>High Risk (&gt;70%)</div>
      <div class="leg-i"><div class="leg-d" style="background:#EF9F27"></div>Medium (40-70%)</div>
      <div class="leg-i"><div class="leg-d" style="background:#27500A"></div>Low (&lt;40%)</div>
      <div id="p1-dataset-info" style="margin-left:auto;font-size:13px;color:var(--color-text-tertiary)">Dataset: 10,000 พนักงาน</div>
    </div>`;

  for (let i = 0; i < 3; i++) {
    container.querySelector(`#p1-tab-${i}`).onclick = () => {
      currentTab = i;
      container.querySelectorAll('.tab').forEach((t, idx) => t.classList.toggle('on', idx === i));
      render();
    };
  }



  // Download PDF Report - Executive Summary
  container.querySelector('#btn-pdf').onclick = () => {
    const pdfContent = `<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<title>PredictaHR — Executive Summary Report</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Inter',sans-serif;color:#1E293B;padding:40px;max-width:800px;margin:0 auto;line-height:1.6}
  h1{font-size:22px;font-weight:700;text-align:center;margin-bottom:4px}
  .subtitle{font-size:13px;color:#64748B;text-align:center;margin-bottom:24px;padding-bottom:16px;border-bottom:2px solid #E2E8F0}
  .section{margin-bottom:20px}
  .section-title{font-size:12px;font-weight:600;color:#64748B;text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid #E2E8F0}
  .kpis{display:flex;gap:12px;margin-bottom:16px}
  .kpi{flex:1;text-align:center;padding:12px;border-radius:8px;border:1px solid #E2E8F0;background:#F8FAFC}
  .kpi-v{font-size:22px;font-weight:700}
  .kpi-l{font-size:11px;color:#64748B;margin-top:2px}
  .finding{padding:10px 12px;margin-bottom:6px;border-radius:6px;border-left:3px solid;font-size:13px;line-height:1.6}
  .finding-red{background:#FEF2F2;border-color:#DC2626;color:#7F1D1D}
  .finding-yellow{background:#FFFBEB;border-color:#D97706;color:#78350F}
  .finding-green{background:#F0FDF4;border-color:#16A34A;color:#14532D}
  .action{padding:10px 12px;margin-bottom:6px;border-radius:6px;font-size:13px}
  .action-tag{display:inline-block;font-size:10px;padding:2px 8px;border-radius:8px;font-weight:600;margin-right:6px}
  .action-title{font-weight:600;display:inline}
  .action-body{font-size:12px;margin-top:3px;opacity:0.85}
  .summary-box{margin-top:16px;padding:16px;border-radius:8px;border:1px solid #E2E8F0;background:#F8FAFC;display:flex;align-items:center;gap:16px}
  .sum-val{text-align:center}
  .sum-num{font-size:24px;font-weight:700}
  .sum-label{font-size:11px;color:#64748B}
  .sum-arrow{flex:1;text-align:center;font-size:18px;color:#94A3B8}
  .sum-result{text-align:center;padding:10px 16px;background:#F0FDF4;border-radius:8px;border:1px solid #BBF7D0}
  .sum-result-num{font-size:20px;font-weight:700;color:#16A34A}
  .sum-result-label{font-size:11px;color:#16A34A}
  .footer{margin-top:24px;padding-top:12px;border-top:1px solid #E2E8F0;font-size:11px;color:#94A3B8;text-align:center}
  @media print{body{padding:20px}@page{margin:15mm}}
</style>
</head>
<body>
<h1>Executive Summary — PredictaHR</h1>
<div class="subtitle">Employee Attrition Prediction Report — Dataset 10,000 พนักงาน</div>

<div class="section">
  <div class="section-title">สถานการณ์ปัจจุบัน</div>
  <div class="kpis">
    <div class="kpi"><div class="kpi-v" style="color:#DC2626">14.76%</div><div class="kpi-l">Attrition Rate รวม</div></div>
    <div class="kpi"><div class="kpi-v" style="color:#D97706">287 คน</div><div class="kpi-l">กลุ่มเสี่ยงสูง (&gt;70%)</div></div>
    <div class="kpi"><div class="kpi-v" style="color:#DC2626">133 คน</div><div class="kpi-l">เสี่ยงสูงสุด (OT+เงินเดือนต่ำ)</div></div>
  </div>
</div>

<div class="section">
  <div class="section-title">สาเหตุหลักที่ค้นพบ</div>
  <div class="finding finding-red">OverTime คือปัจจัยที่ส่งผลมากที่สุด — พนักงานที่ทำ OT เสี่ยงสูงกว่าไม่ทำ OT เกือบ 2 เท่า มี 1,500 คนในกลุ่มนี้</div>
  <div class="finding finding-yellow">เงินเดือน &lt; 3,000 + OT ทำให้ Risk พุ่งถึง 51.9% — กลุ่มนี้มีโอกาสลาออกมากกว่าจะอยู่เสียอีก</div>
  <div class="finding finding-yellow">พนักงานที่ไม่ได้รับการเลื่อนตำแหน่งนาน 6-7 ปี มีอัตราลาออก 19-20% — สัญญาณความอิ่มตัวใน Career</div>
  <div class="finding finding-green">Training และ Stock Option ช่วยลด Risk ได้จริง แต่ยังใช้ไม่เต็มศักยภาพในองค์กร</div>
</div>

<div class="section">
  <div class="section-title">ข้อเสนอแนะเชิงนโยบาย</div>
  <div class="action" style="background:#FEF2F2">
    <span class="action-tag" style="background:#FEE2E2;color:#991B1B">เร่งด่วน</span>
    <div class="action-title" style="color:#991B1B">จำกัด OT และปรับเงินเดือนกลุ่มเสี่ยง</div>
    <div class="action-body" style="color:#7F1D1D">ลด Risk Score ได้ ~596 คน จาก Dataset นี้</div>
  </div>
  <div class="action" style="background:#FFFBEB">
    <span class="action-tag" style="background:#FEF3C7;color:#92400E">ระยะกลาง</span>
    <div class="action-title" style="color:#92400E">วาง Career Path ชัดเจนและเพิ่ม Stock Option</div>
    <div class="action-body" style="color:#78350F">ลด Attrition กลุ่ม Level 1-2 ได้ ~4-5%</div>
  </div>
  <div class="action" style="background:#F0FDF4">
    <span class="action-tag" style="background:#DCFCE7;color:#166534">ระยะยาว</span>
    <div class="action-title" style="color:#166534">เพิ่มความถี่ Training และโปรแกรม Onboarding</div>
    <div class="action-body" style="color:#14532D">สร้าง Engagement ระยะยาว ลด Attrition ~2-3%</div>
  </div>
</div>

<div class="summary-box">
  <div class="sum-val"><div class="sum-num" style="color:#DC2626">14.76%</div><div class="sum-label">ปัจจุบัน</div></div>
  <div class="sum-arrow">→</div>
  <div class="sum-val"><div class="sum-num" style="color:#16A34A">~6.5%</div><div class="sum-label">คาดการณ์</div></div>
  <div class="sum-result"><div class="sum-result-num">~825 คน</div><div class="sum-result-label">รักษาไว้ได้</div></div>
</div>

<div class="footer">
  PredictaHR — Attrition Prediction System &bull; Generated ${new Date().toLocaleDateString('th-TH',{year:'numeric',month:'long',day:'numeric'})}
</div>
</body>
</html>`;
    const w = window.open('', '_blank');
    w.document.write(pdfContent);
    w.document.close();
    setTimeout(() => { w.print(); }, 500);
  };

  render();
}
