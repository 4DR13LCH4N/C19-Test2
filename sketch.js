var PLAY = 1;
var END = 0;
var gameState = PLAY;

var frisk, frisk_running, frisk_collided;
var sans, sans_running, sans_standing;
var ground, invisibleGround, groundImage;
var forest, forestImage;
var cloudsGroup, cloudImage;
var bonesGroup, bone1, bone2, bone3, bone4, bone5, bone6;

var score = 0;
var gameOverImg, restartImg;

function preload(){
  frisk_running = loadAnimation("friskStand.png", "friskWalk.png");
  frisk_collided = loadAnimation("friskCollided.gif");
  sans_running = loadAnimation("sansStand.png", "sansWalk.png");
  sans_still = loadAnimation("sansStill.png");
  
  forestImage = loadImage("forest.png");
  
  bone1 = loadImage("bone1.png");
  bone2 = loadImage("bone2.png");
  bone3 = loadImage("bone3.png");
  bone4 = loadImage("bone4.png");
  bone5 = loadImage("bone5.png");
  bone6 = loadImage("bone6.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
}

function setup() {
  createCanvas(720, 480);

  var message = "You have been filled with Determination ❤";
 console.log(message);
  
  frisk = createSprite(50, 160, 20, 50);
  frisk.addAnimation("friskRunning", frisk_running);
  frisk.addAnimation("friskColliding", frisk_collided);
  frisk.scale = 0.5;

  sans = createSprite(20, 160, 20, 50);
  sans.addAnimation(sans_running);
  sans.addAnimation(sans_still);
  
  forest = createSprite(200, 180, 400, 20);
  forest.addImage(forestImage);
  forest.x = forest.width /2;
  
  gameOver = createSprite(300, 100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300, 140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.visible = false;
  
  //create Bone Groups
  bonesGroup = new Group();

  frisk.setCollider("rectangle", 0, 0, frisk.width,frisk.height);
  frisk.debug = true;

  sans.setCollider("rectangle", 0, 0, 3, sans.height);
  sans.debug = true;
}

function draw() {
  
  background(225);
  //displaying score
  text("Score: " + score, 500, 50);
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;

    frisk.changeAnimation(frisk_running);
    
    forest.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if (forest.x < 0){
      forest.x = forest.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space") && frisk.y >= 100) {
        frisk.velocityY = -12;
    }
    
    //jump when sans is touching bonesGroup
    if(sans.isTouching(bonesGroup && sans.y >= 100)) {
      sans.velocityY = -12;
    }

    //add gravity
    frisk.velocityY = frisk.velocityY + 0.8
  
    //spawn bones on the ground
    spawnBones();
    
    if(bonesGroup.isTouching(frisk)){
        //frisk.velocityY = -12;
        gameState = END;
      
    }
  }
   else if (gameState === END) {

      gameOver.visible = true;
      restart.visible = true;
     
     //change the frisk animation
      frisk.changeAnimation(frisk_collided);

      if(sans.isTouching(frisk || frisk_collided || frisk_running)) {
        sans.velocityX = 0;
        sans.velocityY = 0;
        sans.changeAnimation(sansStill);
      }
    
      forest.velocityX = 0;
      forest.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
      bonesGroup.setLifetimeEach(-1);
      bonesGroup.setVelocityXEach(0);   
   }
  
 
  //stop frisk and sans from falling down
  frisk.collide(invisibleGround);
  sans.collide(invisibleGround);
  
  if(mousePressedOver(restart)) {
    console.log("Reset the Game")
    reset();
    }

  drawSprites();
}

function reset(){
  gameState = PLAY
  gameOver.visible = false;
  restart.visible = false;
  bonesGroup.destroyEach();
  frisk.changeAnimation(frisk_running);
  sans.changeAnimation(sans_running);
  score = 0;
}


function spawnBones(){
 if (frameCount % 60 === 0){
   var bone = createSprite(600,165,10,40);
   bone.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: bone.addImage(bone1);
              break;
      case 2: bone.addImage(bone2);
              break;
      case 3: bone.addImage(bone3);
              break;
      case 4: bone.addImage(bone4);
              break;
      case 5: bone.addImage(bone5);
              break;
      case 6: bone.addImage(bone6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    bone.scale = 0.2;
    bone.lifetime = 300;
   
   //add each obstacle to the group
    bonesGroup.add(bone);
 }
}