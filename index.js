
const map = [                      // This is all boring code to show if something is empty or not 1 = is a wall 0 = empty cell kinda like binary or boolean
  [1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1],
];

const SCREEN_WIDTH = window.innerWidth;   //This make the canvas cover the whole screen
const SCREEN_HEIGHT = window.innerHeight;

const TICK = 30;                         //this will make a function occur every 30 miliseconds

const CELL_SIZE = 32;                   // this is exactly what the variable is called

const FOV = toRadians(80);              //this changes the fov to 60 the average for raycasting

const COLORS = {                        // this stores all coulours we will use
  floor: "#21c23c", // "#ff6361"
  ceiling: "#2990d9", // "#012975",
  wall: "#0f4519", // "#58508d"
  wallDark: "#022408", // "#003f5c"
  rays: "#ffa600",
};

const player = {                //this has many feutures of our player stored inside such as coordinates and angles and speed speed for movement angle for rotations
  x: CELL_SIZE * 1.5,
  y: CELL_SIZE * 2,
  angle: toRadians(0),
  speed: 0,
};

const canvas = document.createElement("canvas");    //this creates the canvas
canvas.setAttribute("width", SCREEN_WIDTH);        //sets the width of the canvas
canvas.setAttribute("height", SCREEN_HEIGHT);     // sets the height of the canvas
document.body.appendChild(canvas);                // renders the canvas

const context = canvas.getContext("2d");          // if you dont know what this does then no point of reading my code you begineer im not saying me Ali is just the best im just saying ur bad if you dont this

function clearScreen() {                          //does exactly what it is called
  context.fillStyle = "green";                     // changes the colour to green
  context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT); // then fills it all in the canvas basically as it uses canvas width and height
}

function renderMinimap(posX = 0, posY = 0, scale, rays) {     // renders the minimap not neccesery but put it in to show people how we make 2d look 3d plus little feuture
  const cellSize = scale * CELL_SIZE;                      // creates variable storing the size of a cell o nthe map remember at the start lots of numbers so when it is one there is cell yeh this just shows size of cell/wall
  map.forEach((row, y) => {                        //the global var at the start is being used now woooo
    row.forEach((cell, x) => {                   
      if (cell) {                                  // if there is a cell or if 1 then sets the cell to grey
        context.fillStyle = "green";
        context.fillRect(
          posX + x * cellSize,                    //now the var from before is used to fill in the wall according to cell size
          posY + y * cellSize,
          cellSize,
          cellSize
        );
      }
    });
  });
  context.fillStyle = "blue";                    // making the player on the mini-map
  context.fillRect(          
    posX + player.x * scale - 10 / 2,              //make player blue on mini map
    posY + player.y * scale - 10 / 2,             //and uses these equations which i definetly didnt search up on the internet and have no clue how they work to make it a downscale of the player position on the mini map
    10,
    10
  );

  context.strokeStyle = "blue";                             // setting colour to blue
  context.beginPath();                                     //this all to make a ray 
  context.moveTo(player.x * scale, player.y * scale);     //making it start from the player head
  context.lineTo(                                        //starts drawing line
    (player.x + Math.cos(player.angle) * 20) * scale,   //then this where line is being made
    (player.y + Math.sin(player.angle) * 20) * scale     //same here
  );                                                    
  context.closePath();                                  //stops drawing
  context.stroke();                                       // shows the stroke

  context.strokeStyle = COLORS.rays;                      // wooo the colors which i made a american english for some reason are in use
  rays.forEach((ray) => {                                // boring stuff now
    context.beginPath();                               //basically lots of lines to send lots of rays woooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo
    context.moveTo(player.x * scale, player.y * scale);  //start at player head
    context.lineTo(                                     //starts drawing line
      (player.x + Math.cos(ray.angle) * ray.distance) * scale, // equations the internet didnt give me definatly not
      (player.y + Math.sin(ray.angle) * ray.distance) * scale //
    ); 
    context.closePath();                                       // stops drawign
    context.stroke();                                         //shows the strokes
  });
}

function toRadians(deg) {                                        //rotations
  return (deg * Math.PI) / 180;                                  // equation that i definetly thought of not ctrl c and ctrl v
}

function distance(x1, y1, x2, y2) {                              //function to calculate its name parameters stores a few values
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)); //i acctualy did this one myself now can u believe it it basically is used to see the distance of a  wall from a player which will be used for textures and other stuff later
}

function outOfMapBounds(x, y) {                                  // checks if you are out of map
  return x < 0 || x >= map[0].length || y < 0 || y >= map.length;// basically checks everywhere which is in the mini map for player or basicaly if the player is in the mini map
}

function getVCollision(angle) {                                  // this checks for vertical collision dont excpect much explination cause the amount of equations i looked up for this and just coded without understanding :)
  const right = Math.abs(Math.floor((angle - Math.PI / 2) / Math.PI) % 2); // abs doesnt matter cause we dont care if it is decimal bit this basically checks for collision on the right

  const firstX = right                                              //SO ALL OF THIS FOR THE RIGHT SIDE OF THE RAYS also changed the fov to 90 looks better in my opinion more playanle
    ? Math.floor(player.x / CELL_SIZE) * CELL_SIZE + CELL_SIZE   
    : Math.floor(player.x / CELL_SIZE) * CELL_SIZE;            

  const firstY = player.y + (firstX - player.x) * Math.tan(angle); //equation i acctually know woooooow
 
  const xA = right ? CELL_SIZE : -CELL_SIZE;                       // if you dont know that this is a condition stop readin my code cause u will probs copie paste it
  const yA = xA * Math.tan(angle);                                 

  let wall;                                                     // wall variable
  let nextX = firstX;                                           //declaring new variables basically first x but just there consts therefore unchangable
  let nextY = firstY;                                            
  while (!wall) {                                                 //while no wall != = no wall
    const cellX = right                                           // wooo new variable for the cells position
      ? Math.floor(nextX / CELL_SIZE)                             // more equations i didnt search up *wink*
      : Math.floor(nextX / CELL_SIZE) - 1;                            
    const cellY = Math.floor(nextY / CELL_SIZE);                   // another variable
        
    if (outOfMapBounds(cellX, cellY)) {                               //checks if out of bounds and if you are break stop
      break;
    }
    wall = map[cellY][cellX];
    if (!wall) {
      nextX += xA;
      nextY += yA;
    } else {
    }
  }
  return {
    angle,
    distance: distance(player.x, player.y, nextX, nextY),
    vertical: true,
  };
}

function getHCollision(angle) {
  const up = Math.abs(Math.floor(angle / Math.PI) % 2);           // most of this is the same as verticall collision
  const firstY = up                                                 // a few differences like err idk its h not v
    ? Math.floor(player.y / CELL_SIZE) * CELL_SIZE                  // equations i dont know which are not from internet
    : Math.floor(player.y / CELL_SIZE) * CELL_SIZE + CELL_SIZE;
  const firstX = player.x + (firstY - player.y) / Math.tan(angle);  // new x variable 

  const yA = up ? -CELL_SIZE : CELL_SIZE;
  const xA = yA / Math.tan(angle);

  let wall;                                             //THERE IS ONLY ONE BIG DIFFERENCE X IS NO LONGER WHAT X WAS IN VERTICAL
  let nextX = firstX;                                   // BECAUSE NOW IT IS NOT VERTICAL IT IS NOW HORIZONTAL SOOOOOO THAT ME-
  let nextY = firstY;                                   // -EANS THAT WHEREEVER X WAS BEFORE IS NOW REPLACED WITH Y 
  while (!wall) {
    const cellX = Math.floor(nextX / CELL_SIZE);
    const cellY = up
      ? Math.floor(nextY / CELL_SIZE) - 1
      : Math.floor(nextY / CELL_SIZE);

    if (outOfMapBounds(cellX, cellY)) {
      break;
    }

    wall = map[cellY][cellX];
    if (!wall) {
      nextX += xA;
      nextY += yA;
    }
  }
  return {
    angle,                                                   //rotations
    distance: distance(player.x, player.y, nextX, nextY),       // shows distance
    vertical: false,                                          // not vertical
  };
}

function castRay(angle) {
  const vCollision = getVCollision(angle);                  //now those long boring functions are used dto cast a ray which isnt a singular one
  const hCollision = getHCollision(angle);

  return hCollision.distance >= vCollision.distance ? vCollision : hCollision;
}

function fixFishEye(distance, angle, playerAngle) {    //the most annoying thing the fish eye effectt this like 99% fixes it the fish eye effect curves walls and cells
  const diff = angle - playerAngle;
  return distance * Math.cos(diff);
}

function getRays() {                        //this is used to get the value of the rays
  const initialAngle = player.angle - FOV / 2;         //basically like the raY stores info then we need it to render the cells so this is inmportant
  const numberOfRays = SCREEN_WIDTH;                    // shows the amount seen by the user
  const angleStep = FOV / numberOfRays;                 // wooo the fov var is being used which i changed again to like 80 or 75 i cant rememberrr
  return Array.from({ length: numberOfRays }, (_, i) => {  // returns the length of the rays or the distance of the cell in front or visible on screen
    const angle = initialAngle + i * angleStep;            // angle of rays in a new var with a equation that i acctually know this time
    const ray = castRay(angle);                         // var casts a ray using function parameter speaks for itself
    return ray;
  });
}

function movePlayer() {                                     // moves player no need to explain code a bit of maths you learn in year 9 cos and sin 
  player.x += Math.cos(player.angle) * player.speed;
  player.y += Math.sin(player.angle) * player.speed;
}

function renderScene(rays) {                                                   //the fun part woooooooooooooooooooooooooooooooooooooooo
  rays.forEach((ray, i) => {                                                  
    const distance = fixFishEye(ray.distance, ray.angle, player.angle);         // woooo we are  finally fixing that annoying fish eye
    const wallHeight = ((CELL_SIZE * 5) / distance) * 277;                      // this is used to show how high wall is i would like it shorter but when i tried it was to small from a distance so i just left it like this 
    context.fillStyle = ray.vertical ? COLORS.wallDark : COLORS.wall;           // basically u know when i was talking about textures yeh so this is using the colours to be darker depending on distance
    context.fillRect(i, SCREEN_HEIGHT / 2 - wallHeight / 2, 1, wallHeight);     // i know this equation so it basically is used to create the scene by using all of the different cells and rendering them
    context.fillStyle = COLORS.floor;                                           //changing floor colour
    context.fillRect(                                                        
      i,                                                                        // filling rects/ the walls or cells
      SCREEN_HEIGHT / 2 + wallHeight / 2,                                       
      1,                                 
      SCREEN_HEIGHT / 2 - wallHeight / 2                                         
    );
    context.fillStyle = COLORS.ceiling;                                          // ceiling / sky blue now
    context.fillRect(i, 0, 1, SCREEN_HEIGHT / 2 - wallHeight / 2);               // already said it
  });
}

function gameLoop() {                                                            // oh it felt sooooo nice coding this function just calling all the functions but then to ruin it i had to add parameters
  clearScreen();                                               //clears screen
  movePlayer();                                                // lets player move
  const rays = getRays();                                      // stores the rays data
  renderScene(rays);                                           // renders everything oh i love seeing this function at work
  renderMinimap(0, 0, 0.75, rays);                             // renders mini map the amount of test i had to do for the perfect minimap
}                                                              // all of this happens by every TICK the variable we made remember

setInterval(gameLoop, TICK);                        // yeh this is the tick thing

canvas.addEventListener("click", () => {            // i never knew this was a thing but was thinking and after watching a whole 4 minute vid on how they work and cool things you can do with this i now know something new
  canvas.requestPointerLock();
});

document.addEventListener("keydown", (e) => {        // add keydown
  if (e.key === "ArrowUp") {                         // if you press arrow key down or hold down anything while it is being pressed it moves by one used to be 2
    player.speed = 1;
  }
  if (e.key === "ArrowDown") {                       // if you press/hold the downarrow it moves -1 basically instead of moving forward +1 its moves negative -1
    player.speed = -1;
  }
});

document.addEventListener("keyup", (e) => {                    //makes sure when you let go it stops moving
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    player.speed = 0;
  }
});

document.addEventListener("mousemove", function (event) {        // this makes the player move towards where the mouse is using mouse cooardinates and making them the same;
  player.angle += toRadians(event.movementX);
});
