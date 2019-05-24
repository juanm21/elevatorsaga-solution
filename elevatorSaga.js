{
    init: function(elevators, floors) {
        
        var minFloor = 0;
        var maxFloor = 0;
        var setMinMaxFloor = function(floorNum){
          if(floorNum < minFloor){
              minFloor = floorNum;
          }  
          if (floorNum > maxFloor){
              maxFloor = floorNum;
          }
        };
        
        var floorRequestUp = [];
        var addFloorRequestUp = function(floorNum){
            floorRequestUp.push(floorNum)
        };

        var floorRequestDown = [];
        var addFloorRequestDown = function(floorNum){
            floorRequestDown.push(floorNum)
        };
        
        floors.forEach(function(floor) {
            
            var number = floor.floorNum();
            var name = 'Floor ['+ number +'] >>> '

            setMinMaxFloor(floor.floorNum());
            
            floor.on("up_button_pressed",function(){
                console.log(name + 'floor.up_button_pressed');
                addFloorRequestUp(floor.floorNum());
            });

            floor.on("down_button_pressed",function(){
                console.log(name + ' floor.down_button_pressed');
                addFloorRequestDown(floor.floorNum());
            });
        });
        
        var irAlPiso = function(elevator, floorNum){
            /*
            if(elevator.currentFloor() < floorNum){
                elevator.goingUpIndicator(true);
                elevator.goingDownIndicator(floorNum == maxFloor);
            }else{
                elevator.goingUpIndicator(floorNum == minFloor);
                elevator.goingDownIndicator(true);
            }
            */
            elevator.goToFloor(floorNum);
        }
        
        elevators.forEach(function(elevator, i){
            
            var number = i;
            var name = 'Elevator ['+ number +'] >>> '
            
            elevator.goingDownIndicator(true);
            elevator.goingUpIndicator(true);
            
            // Triggered when the elevator has completed all its tasks and is not doing anything.
            elevator.on("idle", function() {
                console.log(name + 'elevator.idle');
                
                /*
                if(elevator.destinationDirection() == 'stopped'){
                    if(elevator.currentFloor() == minFloor){
                        elevator.goingUpIndicator(true);
                        elevator.goingDownIndicator(false);
                    }
                    else if(elevator.currentFloor() == maxFloor){
                        elevator.goingUpIndicator(false);
                        elevator.goingDownIndicator(true);
                    }
                    else{
                        elevator.goingUpIndicator(true);
                        elevator.goingDownIndicator(true);
                    }
                }
                */
                
                if(floorRequestUp.length > floorRequestDown.length && floorRequestUp.length > 0){
                    irAlPiso(elevator,floorRequestUp[0]);
                }else if (floorRequestDown.length > 0){
                    irAlPiso(elevator,floorRequestDown[0]);
                }
                
            });

            // Triggered when a passenger has pressed a button inside the elevator.
            elevator.on("floor_button_pressed",function(floorNum){
                console.log(name + 'elevator.floor_button_pressed');
                
                irAlPiso(elevator, floorNum);
            });

            // Triggered slightly before the elevator will pass a floor. 
            // A good time to decide whether to stop at that floor. 
            // Note that this event is not triggered for the destination floor. 
            // Direction is either "up" or "down".
            elevator.on("passing_floor", function(floorNum, direction) { 
                console.log(name + 'elevator.passing_floor---------------------------------');
                console.log(name + 'destinationDirection = ' + elevator.destinationDirection());
            });

            // Triggered when the elevator has arrived at a floor.
            elevator.on("stopped_at_floor",function(floorNum){
                console.log(name + 'elevator.stopped_at_floor >>> ' + floorNum);
                console.log(elevator.destinationQueue)
            });
        });
        
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
       // console.log('update');
    }
}
