// Page 2: Employee Risk Table
function renderPage2(container) {
  const rows = [
    {id:1,name:"สมหมาย ใจดี",dept:"Sales",role:"Sales Rep",level:1,ot:"ใช่",score:91,risk:"high"},
    {id:2,name:"วิภา รักเรียน",dept:"R&D",role:"Lab Tech",level:1,ot:"ใช่",score:84,risk:"high"},
    {id:3,name:"ประเสริฐ มั่นคง",dept:"HR",role:"HR",level:2,ot:"ใช่",score:79,risk:"high"},
    {id:4,name:"นิดา สุขใจ",dept:"R&D",role:"Research Sci",level:2,ot:"ใช่",score:72,risk:"high"},
    {id:5,name:"กิตติ วิชาการ",dept:"Sales",role:"Sales Exec",level:1,ot:"ไม่",score:65,risk:"medium"},
    {id:6,name:"ลลิตา ดีเด่น",dept:"R&D",role:"Lab Tech",level:2,ot:"ใช่",score:61,risk:"medium"},
    {id:7,name:"อนุชา ทำงานดี",dept:"Sales",role:"Sales Rep",level:1,ot:"ไม่",score:54,risk:"medium"},
    {id:8,name:"พรทิพย์ สมบูรณ์",dept:"HR",role:"HR",level:3,ot:"ไม่",score:42,risk:"medium"},
    {id:9,name:"ธนพล เก่งมาก",dept:"R&D",role:"Manager",level:4,ot:"ไม่",score:18,risk:"low"},
    {id:10,name:"สุรีย์ ยิ้มแย้ม",dept:"Sales",role:"Mfg Dir",level:5,ot:"ไม่",score:11,risk:"low"},
  ];
  const riskColor = {high:"#EF4444",medium:"#F59E0B",low:"#22C55E"};
  const badgeClass = {high:"bh",medium:"bm",low:"bl"};
  const badgeTxt = {high:"High Risk",medium:"Medium",low:"Low"};

  container.innerHTML = `
    <div class="topbar">
      <div class="tb-title">Employee Risk Table</div>
      <div class="tb-r">
        <button class="btn-e" style="background:transparent;border:1px solid var(--color-border-primary);color:var(--color-text-primary)">Export CSV</button>
        <button class="btn-e">Export PDF</button>
      </div>
    </div>
    <div class="filters">
      <input type="text" placeholder="ค้นหาชื่อพนักงาน..."/>
      <select><option>ทุก Department</option><option>Sales</option><option>R&D</option><option>HR</option></select>
      <select><option>ทุก Risk Level</option><option>High Risk</option><option>Medium Risk</option><option>Low Risk</option></select>
      <select><option>ทุก Job Level</option><option>Level 1</option><option>Level 2</option><option>Level 3</option></select>
      <select><option>OT: ทั้งหมด</option><option>มี OT</option><option>ไม่มี OT</option></select>
    </div>
    <div class="tbl-wrap">
      <table class="tbl">
        <thead>
          <tr>
            <th style="width:5%">#</th>
            <th style="width:18%">ชื่อพนักงาน</th>
            <th style="width:12%">แผนก</th>
            <th style="width:13%">Job Role</th>
            <th style="width:8%">Level</th>
            <th style="width:8%">OT</th>
            <th style="width:20%">Risk Score</th>
            <th style="width:12%">สถานะ</th>
            <th style="width:4%"></th>
          </tr>
        </thead>
        <tbody id="tbl-body-p2"></tbody>
      </table>
    </div>
    <div class="tfoot">
      <div class="tfoot-txt">แสดง 1-10 จาก 10,000 คน · High Risk: 287 · Medium: 1,245 · Low: 8,468</div>
      <div class="page-btns">
        <button class="pg on">1</button>
        <button class="pg">2</button>
        <button class="pg">3</button>
        <span style="font-size:14px;color:var(--color-text-secondary);padding:3px 4px">...</span>
        <button class="pg">1000</button>
      </div>
    </div>`;

  const tbody = container.querySelector('#tbl-body-p2');
  rows.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="color:var(--color-text-secondary)">${r.id}</td>
      <td style="font-weight:500">${r.name}</td>
      <td>${r.dept}</td>
      <td>${r.role}</td>
      <td style="text-align:center">L${r.level}</td>
      <td style="text-align:center;color:${r.ot==="ใช่"?"#FCA5A5":"var(--color-text-secondary)"}">${r.ot}</td>
      <td>
        <div class="risk-bar">
          <div class="risk-track"><div class="risk-fill" style="width:${r.score}%;background:${riskColor[r.risk]}"></div></div>
          <span style="font-size:14px;font-weight:600;color:${riskColor[r.risk]};min-width:28px">${r.score}%</span>
        </div>
      </td>
      <td><span class="badge ${badgeClass[r.risk]}">${badgeTxt[r.risk]}</span></td>
      <td><button class="btn-view">ดู</button></td>`;
    tbody.appendChild(tr);
  });
}
