const speech=document.getElementById('speech');
const taskList=document.getElementById('taskList');
const calendarDiv=document.getElementById('calendar');
const monthYearDiv=document.getElementById('monthYear');
const playBtn=document.getElementById('playGamesBtn');
const gamesSection=document.getElementById('gamesSection');

let tasks=JSON.parse(localStorage.getItem('tasks')||'[]');
let currentMonth=new Date().getMonth();
let currentYear=new Date().getFullYear();

function updateSpeech(){
  let today=new Date().toISOString().split('T')[0];
  const urgent=tasks.find(t=>t.date<=today);
  speech.textContent=urgent?`Next: ${urgent.text}`:"All clear! Let's play games!";
}

function renderTasks(){
  taskList.innerHTML='';
  let today=new Date().toISOString().split('T')[0];
  tasks.sort((a,b)=>new Date(a.date)-new Date(b.date));
  tasks.forEach((t,i)=>{
    const li=document.createElement('li');
    const due=t.date===today?'(Today)':t.date;
    li.innerHTML=`<span>${t.text} - ${due}</span>`;
    const doneBtn=document.createElement('button');
    doneBtn.textContent='Done';
    doneBtn.onclick=()=>{tasks.splice(i,1);save();};
    const delBtn=document.createElement('button');
    delBtn.textContent='Del';
    delBtn.onclick=()=>{tasks.splice(i,1);save();};
    li.appendChild(doneBtn);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
  updateSpeech();
  renderCalendar();
}

function addTask(){
  const text=document.getElementById('taskInput').value;
  const date=document.getElementById('taskDate').value;
  if(!text||!date) return;
  tasks.push({text,date});
  save();
  document.getElementById('taskInput').value='';
  document.getElementById('taskDate').value='';
}

function save(){
  localStorage.setItem('tasks',JSON.stringify(tasks));
  renderTasks();
}

function changeMonth(delta){
  currentMonth+=delta;
  if(currentMonth>11){currentMonth=0;currentYear++;}
  if(currentMonth<0){currentMonth=11;currentYear--;}
  renderCalendar();
}

function renderCalendar(){
  const now=new Date();
  const month=currentMonth;
  const year=currentYear;
  const monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"];
  monthYearDiv.textContent=`${monthNames[month]} ${year}`;
  const firstDay=new Date(year,month,1);
  const lastDay=new Date(year,month+1,0);
  let html=`<table><tr>`;
  const days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  days.forEach(d=>html+=`<th>${d}</th>`);
  html+='</tr><tr>';
  for(let i=0;i<firstDay.getDay();i++) html+='<td></td>';
  for(let day=1;day<=lastDay.getDate();day++){
    const dateStr=`${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    const isToday=dateStr===now.toISOString().split('T')[0];
    const hasTask=tasks.some(t=>t.date===dateStr);
    html+=`<td class='${isToday?'today':''} ${hasTask?'has-task':''}'>${day}</td>`;
    if((firstDay.getDay()+day)%7===0) html+='</tr><tr>';
  }
  html+='</tr></table>';
  calendarDiv.innerHTML=html;
}

playBtn.onclick=()=>{gamesSection.style.display=gamesSection.style.display==='none'?'block':'none';}

renderTasks();