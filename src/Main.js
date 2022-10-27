import React from "react";
import "./Main.css"

function Main(){
    return (
        <div className="Main">
            <div className='title'>
                <span>Save The <font color={'#1e90ff'}>Earth</font></span> 
                <p className="secondSentence">
                    UN-SDGs: 17 Goals for People, for Planet
                </p>
                <p className='thirdSentence'>
                    Choose a topic below or click on a city
                </p>
            </div>
            <div className="contents">
                1. Clean Water and Sanitation <br/>
                2. Life Below Water <br/>
                3. Life on Land <br/>
                4. Climate Action <br/>
                5. Zero Hunger <br/>
            </div>
            <div className="member">
                <p>2022-2<br/>Computer Graphics</p>
                <p>
                    • 김주하<br/>
                    • 이민아<br/>
                    • 신승건<br/>
                    • 유소연<br/>
                </p>
            </div>
        </div>
    );
}

export default Main;