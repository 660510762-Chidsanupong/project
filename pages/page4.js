// Page 4: HR Insights (based on fixed_hr_insights.html)
function renderPage4(container) {
  let cur = 0;

  function tab0(){
    const features = [
      {label:'OverTime',pct:88,color:'#A32D2D'},
      {label:'MonthlyIncome',pct:72,color:'#A32D2D'},
      {label:'Age',pct:58,color:'#633806'},
      {label:'YearsAtCompany',pct:50,color:'#633806'},
      {label:'JobLevel',pct:44,color:'#633806'},
      {label:'MaritalStatus',pct:36,color:'#633806'},
      {label:'BusinessTravel',pct:30,color:'#633806'},
      {label:'JobSatisfaction',pct:24,color:'#633806'},
      {label:'StockOptionLevel',pct:40,color:'#27500A'},
      {label:'TrainingTimesLastYear',pct:28,color:'#27500A'},
    ];
    return `<div class="row2">
      <div class="card">
        <div class="card-t">SHAP Summary Plot</div>
        <div class="card-s">Feature ที่ส่งผลต่อการลาออกมากที่สุด — ภาพรวมทั้งองค์กร 10,000 คน</div>
        ${features.map((f,i)=>`<div class="shap-row">
          <div class="shap-rank">${i+1}</div>
          <div class="shap-label">${f.label}</div>
          <div class="shap-track"><div class="shap-fill" style="width:${f.pct}%;background:${f.color}"></div></div>
          <div class="shap-val" style="color:${f.color}">${f.pct}%</div>
        </div>`).join('')}
        <div style="display:flex;gap:14px;margin-top:10px;padding-top:8px;border-top:1px solid var(--color-border-tertiary)">
          <div style="display:flex;align-items:center;gap:5px;font-size:13px;color:var(--color-text-secondary)"><div style="width:10px;height:10px;border-radius:2px;background:#A32D2D"></div>เพิ่มความเสี่ยง</div>
          <div style="display:flex;align-items:center;gap:5px;font-size:13px;color:var(--color-text-secondary)"><div style="width:10px;height:10px;border-radius:2px;background:#27500A"></div>ลดความเสี่ยง</div>
        </div>
      </div>
      <div class="card">
        <div class="card-t">SHAP Dependency — OverTime × Income</div>
        <div class="card-s">Combo ที่อันตรายที่สุดใน Dataset</div>
        ${[['OT + Income < 3K','51.9%','#A32D2D','#FCEBEB'],['OT + Income 3K-6K','21.3%','#633806','#FAEEDA'],['OT + Income > 6K','15.2%','#888780','var(--color-background-secondary)'],['ไม่ OT (ทุกระดับ)','11.7%','#27500A','#EAF3DE']].map(([l,v,c,bg])=>`
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:7px">
          <span style="font-size:14px;color:var(--color-text-secondary);width:150px;flex-shrink:0">${l}</span>
          <div style="flex:1;height:8px;background:rgba(30,41,59,0.8);border-radius:4px;overflow:hidden">
            <div style="width:${parseFloat(v)/55*100}%;height:100%;background:${c};border-radius:4px"></div>
          </div>
          <span style="font-size:14px;font-weight:600;color:${c};width:42px;text-align:right">${v}</span>
        </div>`).join('')}
        <div style="margin-top:12px;padding:8px 12px;background:var(--color-background-primary);border-radius:8px;font-size:14px;color:var(--color-text-secondary);border:1px solid var(--color-border-tertiary)">
          OT เพิ่ม SHAP Value เฉลี่ย +22.4% และส่งผลทุกกลุ่มโดยไม่มีข้อยกเว้น
        </div>
      </div>
    </div>`;
  }

  function tab1(){
    const recs = [
      {priority:'เร่งด่วน',title:'ลด / จำกัด OverTime',color:'#791F1F',bg:'#FCEBEB',border:'#F7C1C1',
       body:'OT เป็นปัจจัยที่ส่งผลมากที่สุด (SHAP Value 88%) พนักงานที่ทำ OT ลาออก 22.8% vs ไม่ทำ OT 11.7% มีพนักงานทำ OT อยู่ 1,500 คน',
       action:'จำกัด OT ไม่เกิน 10 ชั่วโมง/สัปดาห์ หรือให้ค่าตอบแทน OT เพิ่ม 1.5 เท่า',
       impact:'กลุ่มเป้าหมาย 1,500 คน ลด Risk Score ลงได้อย่างมีนัยสำคัญ',target:'1,500 คน'},
      {priority:'เร่งด่วน',title:'ปรับเงินเดือนกลุ่ม < 3,000',color:'#791F1F',bg:'#FCEBEB',border:'#F7C1C1',
       body:'กลุ่ม OT + เงินเดือน < 3,000 มีอัตราลาออก 51.9% สูงที่สุดใน Dataset MonthlyIncome เป็น Feature สำคัญอันดับ 2 ใน SHAP (72%)',
       action:'ทบทวน Salary Benchmark กับตลาด และปรับเงินเดือนให้ไม่ต่ำกว่า 5,000',
       impact:'133 คนในกลุ่มนี้ ลด Risk Score จาก 51.9% เหลือ ~15%',target:'133 คน'},
      {priority:'กลาง',title:'วาง Career Path ที่ชัดเจน',color:'#412402',bg:'#FAEEDA',border:'#FAC775',
       body:'พนักงานที่ไม่ได้รับการเลื่อนตำแหน่งนาน 6-7 ปีมีอัตราลาออก 19-20% YearsSinceLastPromotion มีผลต่อ SHAP อย่างมีนัยสำคัญ',
       action:'สร้าง IDP ทบทวนการเลื่อนตำแหน่งทุก 2 ปี และ Job Rotation ทุก 3-5 ปี',
       impact:'65 คนในกลุ่มนี้ ลด Attrition จาก 19% เหลือ ~13%',target:'65 คน'},
      {priority:'กลาง',title:'เพิ่ม Stock Option กลุ่ม Level 1-2',color:'#412402',bg:'#FAEEDA',border:'#FAC775',
       body:'StockOptionLevel = 0 ลาออก 20% vs มี Stock Option 15-16% SHAP ระบุว่า Stock Option ช่วยลด Risk Score ได้จริง (-40%)',
       action:'ให้ Stock Option Level 1 กับพนักงาน Level 1-2 ที่ Performance ดี',
       impact:'~800 คน ลด Attrition ได้ ~4-5%',target:'~800 คน'},
      {priority:'ระยะยาว',title:'เพิ่มความถี่ Training',color:'#173404',bg:'#EAF3DE',border:'#C0DD97',
       body:'Training 5 ครั้ง/ปีลาออกแค่ 12.9% vs ไม่ได้ Training เลย 15.4% มาจาก Feature TrainingTimesLastYear ใน Dataset',
       action:'วาง Training Calendar ให้ครบทุกคนอย่างน้อย 4-5 ครั้ง เน้น Job-relevant Skills',
       impact:'ลด Attrition ได้ ~2.5% สำหรับพนักงานทั้งหมด',target:'ทุกพนักงาน'},
      {priority:'ระยะยาว',title:'โปรแกรม Onboarding พนักงานใหม่',color:'#173404',bg:'#EAF3DE',border:'#C0DD97',
       body:'กลุ่ม YearsAtCompany ≤ 1 มีอัตราลาออกสูงสุดใน Dataset พนักงานที่อยู่พ้น 5 ปีแรกมีแนวโน้มอยู่ต่อนานขึ้น',
       action:'สร้าง Onboarding Program 6 เดือน มี Buddy System และ Check-in ทุก 3 เดือน',
       impact:'กลุ่ม YearsAtCompany ≤ 1 ลด Attrition จาก ~18% เหลือ ~12%',target:'พนักงานใหม่'},
    ];
    return `<div style="margin-bottom:13px;font-size:14px;color:var(--color-text-secondary)">HR Recommendations 6 ข้อ — เรียงตามความเร่งด่วน มี Data Evidence รองรับทุกข้อ</div>
    ${recs.map(r=>`
    <div class="rec-card" style="background:${r.bg};border-color:${r.border}">
      <div class="rec-top">
        <div class="rec-title" style="color:${r.color}">${r.title}</div>
        <div style="display:flex;gap:6px">
          <span style="font-size:13px;padding:3px 10px;border-radius:10px;background:rgba(255,255,255,0.5);color:${r.color}">${r.priority}</span>
          <span style="font-size:13px;padding:3px 10px;border-radius:10px;background:rgba(255,255,255,0.5);color:${r.color}">${r.target}</span>
        </div>
      </div>
      <div class="rec-body" style="color:${r.color};opacity:0.9">${r.body}</div>
      <div class="rec-evidence" style="color:${r.color};background:rgba(255,255,255,0.5)">
        <span style="font-weight:500">Action:</span> ${r.action}<br>
        <span style="font-weight:500">ผลที่คาดหวัง:</span> ${r.impact}
      </div>
    </div>`).join('')}`;
  }

  function render() {
    const body = container.querySelector('.body');
    if(cur===0) body.innerHTML=tab0();
    else body.innerHTML=tab1();
  }

  container.innerHTML = `
    <div class="topbar">
      <div class="tb-title">HR Insights</div>
    </div>
    <div class="tabs">
      <div class="tab on" id="p4-tab-0">SHAP Summary</div>
      <div class="tab" id="p4-tab-1">Recommendations</div>
    </div>
    <div class="body"></div>`;

  for(let i=0;i<2;i++){
    container.querySelector(`#p4-tab-${i}`).onclick = () => {
      cur=i;
      container.querySelectorAll('.tab').forEach((t,idx)=>t.classList.toggle('on',idx===i));
      render();
    };
  }
  render();
}
