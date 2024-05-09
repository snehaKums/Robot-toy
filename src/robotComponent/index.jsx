import React, { useState } from 'react';
import {
    LEFT,
    MOVE,
    PLACE,
    REPORT,
    RIGHT,
    MAX_UNIT,
    MIN_UNIT,
    MOVEMENT_MAP,
    DIRECTIONS_MAP
} from "./constants";
import "./index.css";

const isNil = value => typeof value === "undefined" || value === null;

const isNotNumber = value => isNil(value) || isNaN(value) || `${value}`.trim() === "";

const isValidUnit = value => (value >= MIN_UNIT && value <= MAX_UNIT);

//Validate the units entered for PLACE command
const validateUnits = (x, y) => {
    if (isNotNumber(x) || isNotNumber(y)) {
        return false;
    }
    return (isValidUnit(Number(x)) && isValidUnit(Number(y)))
};

const getDegrees = (degree, variance) => {
    return (360 + degree + variance) % 360;
};

 function ToyRobot() {

    const [toyPosition, setToyPosition] = useState('');
    const [toyMoveDir, setToyMoveDir] = useState('');
    let unitX;
    let unitY;
    let directionInDegree;
    let isPlacedOnTable = false;

    const setUnits = (x,y) => {
        unitX = Number(x);
        unitY = Number(y);
    }

    const placeRobot = (place = "") => {
        const [xUnit, yUnit, direction] = typeof place === "string" ? place.split(" ") : "";
        if (!validateUnits(xUnit, yUnit)) {
            return ["ERROR: Invalid/Incomplete position for PLACE. Try units within 0 to 5", ""];
        }
        if (isNil(direction) || isNil(DIRECTIONS_MAP[direction])) {
            return ["ERROR: Invalid direction for PLACE. Try either EAST, WEST, NORTH or SOUTH", ""];
        }
        setUnits(xUnit, yUnit);
        directionInDegree = DIRECTIONS_MAP[direction];
        isPlacedOnTable = true;
        console.log("Robot placed at", xUnit, yUnit, direction);
        return ["", ""];
    };

    const moveRobot = () => {
        const variance = MOVEMENT_MAP[directionInDegree];
        const newUnitX = unitX + variance.x;
        const newUnitY = unitY + variance.y;
        if (validateUnits(newUnitX, newUnitY)) {
            setUnits(newUnitX, newUnitY);
            return ["", ""];
        }
        // console.log("Robot moved");
        return ["ERROR: MOVE is not allowed in current direction. Try LEFT or RIGHT before MOVE", ""];
    };

    const turnLeft = () => {
        directionInDegree = getDegrees(directionInDegree, -90);
        return ["", ""];
    };

    const turnRight = () => {
        directionInDegree = getDegrees(directionInDegree, 90);
        return ["", ""];
    };

    const reportRobot = () => {
        return [` ${unitX},${unitY},${DIRECTIONS_MAP.getDirectionFromDegree(directionInDegree)}`]
    };
    
    const getInstruction = ({command, args}) => {
        if (!command) {
            return ["", ""];
        }
        if (!isPlacedOnTable && command !== PLACE) {
            return [" Place the robot on the table first", ""];
        }
        switch (command) {
            case PLACE:
                return placeRobot(args);
            case REPORT:
                return reportRobot();
            case MOVE:
                return moveRobot();
            case LEFT:
                return turnLeft();
            case RIGHT:
                return turnRight();
            default:
                return ["", ""];
        }
    };
    const handlePositionChange = (event) => {
        setToyPosition(event.target.value);
    };
    const handleToyMove = (event) => {
        setToyMoveDir(event.target.value);
    };
    const handleMultipleMoves = (command, args) => {
        let cmd = command.split(" ");
        for(let k=0;k<cmd.length;k++){
            getInstruction({command: cmd[k], args: args})
        }
    }
    
    return (
        <div className="toyRobotCss">
            <div>
                <div className="styleDiv">
                    <p className="textCss">Enter Position and Direction to Place Robot : </p>
                    <input className="inputCss" type="text" value={toyPosition} placeholder="ex:0 0 NORTH" onChange={handlePositionChange} />
                </div>
                HINT: 0 0 NORTH <br />
                {getInstruction({command: PLACE, args:toyPosition.toUpperCase() })}
            </div>
           <div>
                <div className="styleDiv">
                    <p className="textCss">Enter LEFT/RIGHT/MOVE to move Robot : </p>
                    <input className="inputCss" type="text" value={toyMoveDir} placeholder="ex:MOVE" onChange={handleToyMove} /> <br />
                </div>
                HINT(For Multiple/Sequence of command): MOVE LEFT MOVE  <br />
                {handleMultipleMoves(toyMoveDir.toUpperCase(),"")}
           </div>
           <div>
                <div className="styleDiv">
                    <p className="textCss">Robot current Position (command: REPORT) : </p>
                    <p className="reportText">{getInstruction({command: REPORT, args: ""})}</p>
                </div>
           </div>
            
        </div>
    );
}

export default ToyRobot;