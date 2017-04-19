/*****************************************************************
 File: ReviewR
 Author: Jonathan Dure
 Description:
    An item review app
 Version: 3.0.0
 Updated: April 19th 2017
 *****************************************************************/
var app = {
    reviews: [],
    currentItem: null,
    rate: 2,
    imgPath: null,
    stars: null,
    init: function () {
        console.log('init');
        document.addEventListener('deviceready', app.onDeviceReady);
    },
    onDeviceReady: function () {
        app.showReviews();
        document.getElementById('addReview').addEventListener('touchend',app.saveReview);
        document.getElementById('cancel').addEventListener('touchend',app.canReview);
        document.getElementById('photo').addEventListener('touchstart', app.myCamera);
        document.getElementById('backBtn').addEventListener('touchend', app.backBtn);
        document.getElementById("delForm").addEventListener('touchend', app.selItem);
        document.getElementById('addModal').addEventListener('touchend', app.showPictureBtn); // show btn and remove img
        document.querySelector(".allStars").addEventListener('touchstart', function () {
            app.stars = document.querySelectorAll('.star');
            app.listeners();
            app.setRating();
        });
        console.log('Device is working');
    },



    showReviews: function () {
        var listContainer = document.getElementById("listContainer");
        var isExistLocalStorage = localStorage.getItem('ReviewR-dure0018');
        // Display Local Storage Items on Load
        if (isExistLocalStorage) {
            listContainer.innerHTML = "";
            var reviews = app.reviews;
            reviews = JSON.parse(localStorage.getItem('ReviewR-dure0018'));
            //For Each loop for the review Items in local Storage
            reviews.forEach(function(item){
                //Create Li
                var li = document.createElement('li');
                li.className = "table-view-cell media";
                //Will need to add Image and Star Ratings for each
                //Create Anchor
                var anchor = document.createElement('a');
                anchor.className = "navigate-right";

                //create Span
                var trash = document.createElement('span');
                trash.className = "media-object pull-right icon icon-trash";

                //create Image
                var img = document.createElement('img');
                img.className = "media-object pull-left";
                img.setAttribute('src',item.img); //item.img does not exist yet
                img.innerHTML = item.img;
                if(img && img.style){
                    img.style.width = "72px";
                    img.style.height = "72px";
                }

                //crete Div
                var nameDiv = document.createElement('div');
                nameDiv.className = "media-body";
                nameDiv.textContent = item.name;
                nameDiv.setAttribute('data-id', item.id);
                // Name and rating should go inside this div

                //create P
                var describe = document.createElement('p');
                describe.innerHTML = item.desc + "<br>" + item.rating + " " + "stars";
                //Append the children
                anchor.setAttribute('href',"#delModal");
                anchor.appendChild(trash);
                anchor.appendChild(nameDiv);
                anchor.appendChild(img);
                nameDiv.appendChild(describe);
                li.appendChild(anchor);
                listContainer.appendChild(li);
                //get Item ID
                li.addEventListener('touchend',function (ev) {

                   if (ev.currentTarget) {
                       app.currentItem = nameDiv.getAttribute('data-id');
                       console.log(app.currentItem);
                       app.selItem();
                   }
                })
            });
        }
    },

    saveReview: function () {
        var id = Math.floor(Date.now() / 1000);
        var item = document.getElementById('item_name').value;
        var desc = document.getElementById('item_des').value;
        var rating = app.rate;
        var img = app.imgPath;

        if (app.currentItem) {
            app.reviews.forEach(function (item) {
                if (item.id !== app.currentItem) {
                    item.name = document.getElementById('item_name').value;
                    item.desc = document.getElementById('item_des').value;
                    item.rating = app.rate;
                    item.img = img;
                }
            });

        } else {
            var reviewObj = {
                id: id
                , name: item
                , desc: desc
                , rating: rating
                , img: img

            };

            // Save to local Storage
            app.reviews.push(reviewObj);

            // localStorage.setItem('ReviewR-dure0018', JSON.stringify(reviews));
        }
        localStorage.removeItem('ReviewR-dure0018');
        localStorage.setItem('ReviewR-dure0018', JSON.stringify(app.reviews));

        app.canReview();
        app.showReviews();
    },

    canReview: function () {
        document.getElementById('myForm').reset();
        document.getElementById('addModal').className = "modal";
    }, 
    myCamera: function () {
        var cameraOptions = {
            destinationType: Camera.DestinationType.FILE_URI,
            encodingType: Camera.EncodingType.PNG,
            mediaType: Camera.MediaType.PICTURE,
            pictureSourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            targetWidth: 300,
            targetHeight: 300
        };
        navigator.camera.getPicture(app.cameraSuccess, app.cameraError, cameraOptions);

    },
    cameraSuccess: function (imageURI) {
        console.log('nice picture');
        var rateDiv = document.getElementById("starRating");
        var myPic = document.getElementById("myImg");
        var pictureBtn = document.getElementById("photo");
        myPic.className = "media-object pull-left";
        myPic.src = imageURI;
        myPic.classList.remove("hidden");
        app.imgPath = imageURI;


        if (myPic) {
            myPic.style.width = "96px";
            myPic.style.height = "96px";
            pictureBtn.style.display = "none";
        }

    },
    cameraError: function (msg) {
        alert('Failed to process picture: ' + msg);
    },

    listeners: function () {
        [].forEach.call(app.stars, function (star,index) {
            star.addEventListener('click',(function (idx) {
                console.log('adding listener', index);
                return function () {
                    app.rate = idx + 1;
                    console.log('Rating is now', app.rate);
                    app.setRating();
                }
            })(index));
        });
    },

    setRating:function () {
        [].forEach.call(app.stars,function (star,index){
            if(app.rate > index){
                star.classList.add('rated');
                // console.log('added rated on', index);
            }else{
                star.classList.remove('rated');
                // console.log('removed rated on', index);
            }
        });
    },

    backBtn: function () {
        document.getElementById('delForm').reset();
        document.getElementById('delModal').className = "modal";
    },

    selItem: function () {
        var imgDiv = document.getElementById("imgDiv");

        var itemRating = document.getElementById("item_rating");

        app.reviews.forEach(function (value,i) {
            if (value.id == app.currentItem) {
                var currentImg = document.createElement('img');
                if(currentImg){
                    currentImg.className = "media-object";
                    currentImg.setAttribute('src',value.img);
                    currentImg.style.width = "300px";
                    currentImg.style.height = "300px";
                    currentImg.style.position = "absolute";
                    currentImg.style.display = "block";
                    currentImg.style.margin = "0 auto";
                    //append current Image
                    imgDiv.appendChild(currentImg);
                    event.preventDefault();
                }else{
                    imgDiv.removeChild(currentImg);
                    // app.backBtn();
                    // app.showReviews();
                }

                itemRating.value = value.rating + "stars";
                document.getElementById('deleteBtn').addEventListener('touchend', app.delItem(i));


            }
        });
        console.log('selected');
    },

    delItem: function (id) {
        return function () {
            console.log("delete : "+id);
        app.reviews.splice(id, 1);
        localStorage.removeItem('ReviewR-dure0018');
        localStorage.setItem('ReviewR-dure0018', JSON.stringify(app.reviews));
        console.log('deleted');
        app.showReviews();
        app.currentItem = null; // have to set it to null to create new item
        app.backBtn();
        }

    },

    showPictureBtn: function () {
        var picBtn = document.getElementById("photo");
        picBtn.style.display = "block";
        var currentPic = document.getElementById('myImg');
        console.log("current pic", currentPic);
            currentPic.classList.add("hidden");

    }

};
app.init();
