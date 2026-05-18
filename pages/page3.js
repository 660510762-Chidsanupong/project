// Page 3: Prediction Tool
function renderPage3(container) {
  const shapData = [
    {label:"OverTime = Yes",val:+22.4,color:"#EF4444"},
    {label:"Income = 2,500",val:+18.1,color:"#EF4444"},
    {label:"Age = 23",val:+12.3,color:"#F59E0B"},
    {label:"YearsAtCompany = 1",val:+8.6,color:"#F59E0B"},
    {label:"JobSatisfaction = 2",val:+4.2,color:"#F59E0B"},
    {label:"Single",val:+3.6,color:"#F59E0B"},
    {label:"Travel Frequently",val:+3.1,color:"#F59E0B"},
    {label:"StockOption = 0",val:-2.4,color:"#22C55E"},
    {label:"WorkLifeBalance=1",val:-2.1,color:"#22C55E"},
  ];
  const maxVal = 22.4;

  container.innerHTML = `
    <div class="topbar">
      <div class="tb-title">Prediction Tool</div>
      <div style="font-size:14px;color:var(--color-text-secondary);flex:1">กรอกข้อมูลพนักงาน → ได้ Risk Score ทันที</div>
      <div class="tb-r">
        ${themeToggleHTML()}
      </div>
    </div>
    <div class="body-grid">
      <div class="card" style="overflow:auto">
        <div class="card-t">ข้อมูลพนักงาน</div>
        <div class="form-2col">
          <div class="form-row"><label>อายุ (Age)</label><input type="number" value="23" min="18" max="60"/></div>
          <div class="form-row"><label>รายได้ต่อเดือน</label><input type="number" value="2500" min="1000"/></div>
        </div>
        <div class="form-row"><label>OverTime</label><select><option selected>Yes — ทำงานล่วงเวลา</option><option>No — ไม่ทำ</option></select></div>
        <div class="form-2col">
          <div class="form-row"><label>Job Level</label><select><option selected>Level 1 (Entry)</option><option>Level 2</option><option>Level 3</option><option>Level 4</option><option>Level 5</option></select></div>
          <div class="form-row"><label>Job Role</label><select><option selected>Sales Representative</option><option>Lab Technician</option><option>Research Scientist</option><option>Manager</option></select></div>
        </div>
        <div class="form-2col">
          <div class="form-row"><label>Marital Status</label><select><option selected>Single</option><option>Married</option><option>Divorced</option></select></div>
          <div class="form-row"><label>Business Travel</label><select><option>Non-Travel</option><option>Travel Rarely</option><option selected>Travel Frequently</option></select></div>
        </div>
        <div class="form-2col">
          <div class="form-row"><label>Years at Company</label><input type="number" value="1" min="0"/></div>
          <div class="form-row"><label>Stock Option Level</label><select><option selected>0 — ไม่มี</option><option>1</option><option>2</option><option>3</option></select></div>
        </div>
        <div class="form-2col">
          <div class="form-row"><label>Job Satisfaction</label><select><option>1 — ต่ำมาก</option><option selected>2 — ต่ำ</option><option>3 — ปานกลาง</option><option>4 — สูง</option></select></div>
          <div class="form-row"><label>Work Life Balance</label><select><option selected>1 — แย่</option><option>2 — พอใช้</option><option>3 — ดี</option><option>4 — ดีมาก</option></select></div>
        </div>
        <button class="predict-btn">Predict Risk Score</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:14px;overflow:auto">
        <div class="result-card">
          <div style="font-size:14px;color:var(--color-text-secondary);margin-bottom:8px">Risk Score</div>
          <div class="result-score">78%</div>
          <div class="result-label">ความเสี่ยงที่จะลาออก</div>
          <div class="result-badge">High Risk</div>
          <div style="margin-top:10px;font-size:14px;color:var(--color-text-secondary)">Baseline องค์กร: 14.76% · สูงกว่า 5.3 เท่า</div>
        </div>
        <div class="card" style="flex:1">
          <div class="shap-title">SHAP Waterfall — ทำไมถึง 78%?</div>
          <div style="display:flex;justify-content:space-between;font-size:13px;color:var(--color-text-secondary);margin-bottom:8px;padding:0 4px">
            <span>ลด Risk</span>
            <span>Baseline = 14.76%</span>
            <span>เพิ่ม Risk</span>
          </div>
          <div id="shap-rows-p3"></div>
          <div style="border-top:1px solid var(--color-border-tertiary);margin-top:10px;padding-top:10px">
            <div class="action-box">
              <div class="action-title">HR Action แนะนำ</div>
              <div class="action-item">พิจารณาลด OT หรือให้ค่าตอบแทน OT เพิ่ม</div>
              <div class="action-item">ทบทวนโครงสร้างเงินเดือน — ต่ำกว่า Benchmark</div>
              <div class="action-item">วางแผน Career Path ให้ชัดเจน</div>
              <div class="action-item">พิจารณา Stock Option เพื่อรักษาพนักงาน</div>
            </div>
          </div>
        </div>
      </div>
    </div>`;

  const shapContainer = container.querySelector('#shap-rows-p3');
  shapData.forEach(d => {
    const row = document.createElement('div');
    row.className = 'shap-row';
    const pct = Math.abs(d.val) / maxVal * 44;
    const isPos = d.val > 0;
    row.innerHTML = `
      <div class="shap-label">${d.label}</div>
      <div class="shap-bar-wrap">
        <div class="shap-baseline"></div>
        <div class="shap-bar" style="width:${pct}%;${isPos?'left:50%':'right:50%'};background:${d.color}"></div>
      </div>
      <div class="shap-val" style="color:${d.color};font-weight:600">${d.val>0?'+':''}${d.val}%</div>`;
    shapContainer.appendChild(row);
  });
}
