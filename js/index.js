$(function() {    
    const gameSenceCenter = {};  
    const scoreBoard = document.querySelector(".score");
    const timer = document.querySelector(".time");
    const moles = [...document.querySelectorAll(".mole")];
    const hammer = [...document.querySelectorAll(".hammer")];
    const btnStart = document.querySelector(".btnStart");
    const btnRetart = document.querySelector(".btnRetart");
    const btnService = document.querySelector(".btnService");
    const model = document.querySelector(".model");
    const btnExit = document.querySelector(".btnExit");
    const bg3 = document.querySelector(".popBg3");
    const bgRed = document.querySelector(".bgRed");
    const gameover = document.querySelector(".gameover");
    const gameoverSpan = document.querySelector(".gameover span");
    const marquee = document.querySelector(".marquee");
    const popMsg = document.querySelector(".popMsg");
    const totalNum = document.querySelector(".total");
    const status = moles.reduce((prev, current, index)=>{
        prev[index]= false;
        return prev;
    }, {})
    let score = 0;
    let timeUp = true;
    let time = 45;  

    Com.browserRedirect() ? (gameSenceCenter.pc = false) : (gameSenceCenter.pc = true); 
     
    $(".badge").on("click", function(){        
        let top = $("#gameStage").offset().top;       
        gameSenceCenter.pc ?  window.scrollTo(0, top-220) : window.scrollTo(0, top-150);  
    })  
    $(".popBg3").show(); 
    
    const init = function(){
        setScore(0);
        timeUp = true;
        time = 45;
        timer.textContent = time;
        btnStart.style.display = "block";
        bg3.style.display = "block";
        model.style.display = "flex";  
        btnRetart.style.display = "none";
        btnService.style.display = "none";
        marquee.classList.remove("marqueeActive");
    }
    const clickHandler = function(){
        hammer.forEach((h)=>{
            h.style.display = 'none';
        })
        if(molesProxy[moles.indexOf(this)]){         
            this.style.backgroundImage = `url(./img/mole${this.dataset.babe}t.png)`;
            console.log(this.style.backgroundImage)
            hammer[moles.indexOf(this)].style.display = "block";
            if(this.dataset.babe == 5){
                setScore(score+50)
            }else if(this.dataset.babe == 4){
                bgRed.style.display = "block";
                setTimeout(()=>{
                    bgRed.style.display = "none";
                },100);
                if(score >= 30) setScore(score-30)
            }else{
                setScore(score+20)
            }
            if(score >= 100 && score <150){
                marquee.textContent = "恭喜累计达 100分 继续打起来~"
                marquee.classList.add("marqueeActive");
               
                // console.log("2",marquee.offsetLeft )
            }else if(score >= 300 && score <350){
                marquee.textContent = "恭喜累计达 300分 继续打起来~"
                marquee.classList.add("marqueeActive");
               
            }else if(score >= 600 && score <650){
                marquee.textContent = "恭喜累计达 600分 继续打起来~"
                marquee.classList.add("marqueeActive");
               
            }else if(score >= 800 && score <850){
                
            }
            if(marquee.offsetLeft <= 0){
                marquee.classList.remove("marqueeActive");
            }
            setTimeout(()=>{
                molesProxy[moles.indexOf(this)] = false;
                hammer[moles.indexOf(this)].style.display = "none";
            },300);
        }
    }
    const molesProxy = new Proxy(status,{
        get(target, key){
            return target[key];
        },
        set(target, key, value){
            target[key] = value;
            moles[key].removeEventListener("click", clickHandler)
            if(value){
                moles[key].addEventListener("click", clickHandler)
                moles[key].classList.add("up");
            }else{
                moles[key].classList.remove("up");
            }
        }
    })
    const setScore = function(s){
        score = s;
        scoreBoard.textContent = score;
    }
    const getRandomMole = function(){
        const mole = Math.floor(Math.random() * moles.length);
        const times = Math.random() * 1000 + 1500//(2000 - 1000)+ 1800; 
        const babe = Math.floor(Math.random() * 5 + 1);
        let speed = 0, delay = 1000;
        if(timeUp) return
        if(molesProxy[mole]) return getRandomMole();
        setTimeout(()=>{
            moles[mole].dataset.babe = babe;
            moles[mole].style.backgroundImage = `url(./img/mole${babe}.png)`;
            molesProxy[mole] = true;
        },300)   
        time>35 ? speed=0: time>25 ? (speed=200, delay=700) : time>15 ? (speed=600, delay=300) : (speed=1100, delay=250);
        setTimeout(()=>{
            if(!timeUp) return getRandomMole();
        },delay);
        setTimeout(()=>{
            molesProxy[mole] = false;
        },times-speed);
    }
    const startGame = function(){
        // if(account === document.querySelector("[name='account']").value || accountApp()){
            btnStart.style.display = "none";
            bg3.style.display = "none";   
            model.style.display = "none";    
            timeUp = false;
            getRandomMole();
            const t = setInterval(() => {
                if(timeUp) clearInterval(t);
                time--;
                timer.textContent = time;        
                if(time <= 0){
                    clearInterval(t);
                    timeUp = true;
                    bg3.style.display = "block";
                    gameover.style.display = "block";
                    gameoverSpan.textContent = `总分：${score} 分`;
                    totalNum.textContent = score;
                    setTimeout(()=>{
                        popMsg.style.display = "block";
                        gameover.style.display = "none";
                        setTimeout(()=>{
                            popMsg.style.display = "none";
                            btnRetart.style.display = "block";
                            btnService.style.display = "block";
                        },3000);
                    },3000); 
                } 
            }, 1000);
        // }
    }
    btnStart.addEventListener("click", startGame);
    btnRetart.addEventListener("click", init);
    btnExit.addEventListener("click", init);
});




