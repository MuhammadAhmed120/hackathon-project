import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, onSnapshot, getDocs, collection, where, query, orderBy, addDoc, deleteDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBN3vGd280DGQv07ZekbhDX7PYuXCKGddM",
  authDomain: "hackathon-35351.firebaseapp.com",
  projectId: "hackathon-35351",
  storageBucket: "hackathon-35351.appspot.com",
  messagingSenderId: "682023538442",
  appId: "1:682023538442:web:eebf3e13e57011801a34f3",
};

// let currentTime = new Date()
// console.log(currentTime.getDate())
// console.log(currentTime.getDay())
// console.log(currentTime.getFullYear())
// console.log(currentTime.getHours())
// console.log(currentTime.getMinutes())
// console.log(currentTime)
// let currentDate = curre

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

let firstName = document.querySelector("#firstname");
let lastName = document.querySelector("#lastname");
let userEmail = document.querySelector("#email");
let userPassword = document.querySelector("#password");
let repPassword = document.querySelector("#rep-password");

let loader = document.querySelector(".loader1");
let dashLoader = document.querySelector("#dash-loader");
let postingCon = document.querySelector("#postingLoader");
let updatingCon = document.querySelector("#updatingLoader");
let postingLoader = document.querySelector("#posting-Loader");
let updatingLoader = document.querySelector("#updating-loader");

let postOpa = document.querySelector('.postOpa')

let bannerPic = document.querySelector(".banner");
let profilePic = document.querySelector(".profile");
let topName = document.querySelector("#top-name");
let profileName = document.querySelector("#profile-name");

let bannerBut = document.querySelector("#banner-input");
let profileBut = document.querySelector("#profile-input");

let changeBan = document.querySelector("#changeBan");
let changePic = document.querySelector("#changePic");
let textA = document.querySelector(".textB");
let textP = document.querySelector(".textP");

let profileBio = document.querySelector("#profile-bio");

let album01 = document.querySelector("#album01");
let album02 = document.querySelector("#album02");
let album03 = document.querySelector("#album03");

let album01Pic = document.querySelector("#album1-pic");
let album02Pic = document.querySelector("#album2-pic");
let album03Pic = document.querySelector("#album3-pic");

let nameInp = document.querySelector("#nameInp");
let bioInp = document.querySelector("#bioInp");
let emailInp = document.querySelector("#emailInp");
let passwordInp = document.querySelector("#passwordInp");

let profCon = document.querySelector(".profile-name");

let profileCon = document.querySelector(".con");
let editProfile = document.querySelector("#edit-but");
let editSetting = document.querySelector("#editSetting");
let updateBut = document.querySelector("#updateBut");
let cancelBut = document.querySelector("#cancelBut");

// let postBut = document.querySelector('#post-but')

let titleInp = document.querySelector("#title-inp");
let contentInp = document.querySelector("#content-inp");

let blogCon = document.querySelector("#blog-con");
let myBlogCon = document.querySelector("#my-blog");

const userParameter = (new URLSearchParams(window.location.search)).get('user');
const hasParameter = (new URLSearchParams(window.location.search)).has('user');

if (!hasParameter) {
  const addBlog = async () => {
    let title = titleInp.value;
    let content = contentInp.value;
    let time = serverTimestamp()
    if (title.match(/^(?=\s*$)/g)) {
      titleInp.focus();
    }
    else if (content.match(/^(?=\s*$)/g)) {
      contentInp.focus()
    }
    else {
      if (postingCon && postingLoader && postOpa) {
        postingCon.style.display = "flex"
        postingLoader.style.display = "flex"
        postOpa.style.opacity = 0.4
      }
      let userID = localStorage.getItem("UID");
      const userDoc = await getDoc(doc(db, "users", userID));
      const userData = userDoc.data();
      const docRef = await addDoc(collection(db, "blogs"), {
        blogTitle: title,
        blogCon: content,
        timestamp: time,
        user: userData
      });
      titleInp.value = "";
      contentInp.value = "";
      postOpa.style.opacity = 1
    }
  };

  window.addBlog = addBlog;

  const printBlog = async () => {
    const q = query(collection(db, "blogs"), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (data) => {
      try {
        if (dashLoader) {
          // dashLoader.style.display = "none";
        }

        data.docChanges().forEach(async (blog) => {
          if (blog.type === "removed") {
            const blogElement = document.getElementById(blog.doc.id);
            if (blogElement) {
              blogElement.remove();
            }
            return;
          }

          const blogData = blog.doc.data();
          const userID = blogData.user.userID;
          const currentID = localStorage.getItem('UID');

          try {
            if (userID) {
              let userProf = blogData.user.profileImg;
              let nameUser = `${blogData.user.firstName} ${blogData.user.lastName}`;

              let blogHTML = `
            <div class="blog">
              ${currentID === userID ? `` : `<div class="visit">
              <a href="profile.html?user=${userID}"><i class="fa-solid fa-street-view"></i></a>
            </div>`}
          
              <div class="blog-title">
                  <div>
                      <img src="${blogData.user.profileImg ? userProf : 'Images/user-icon.png'}" alt="" id="blog-img">
                  </div>

                  <div>
                      <div>
                          <h2 id="blog-title">${blog.doc.data().blogTitle}</h2>
                      </div>

                      <div class="blog-info">
                          <p id="blogUserName">${nameUser}</p>
                          <p>-</p>
                          <p id="blogTime">${blogData.timestamp.toDate().toLocaleString()}</p>
                      </div>
                  </div>
              </div>

              <div id="blog-content">${blog.doc.data().blogCon}</div>

              ${currentID === userID ? `<div>
                  <button class="blog-but" id="blog-delete" onclick="deleteBlog(this.parentNode.parentNode, '${blog.doc.id}')">Delete</button>
                  <button class="blog-but" id="blog-edit" onclick="editBlog('${blog.doc.id}', '${blog.doc.data().blogTitle}', '${blog.doc.data().blogCon}', this.parentNode.parentNode)">Edit</button>
              </div>` : ``}
            </div>`;

              if (postingCon && postingLoader) {
                postingLoader.style.display = "none"
                postingCon.style.display = "none"
              }

              if (location.pathname.includes('/dashboard')) {
                blogCon.innerHTML += blogHTML
              }

              if (currentID === userID && location.pathname.includes('/profile')) {
                myBlogCon.innerHTML += blogHTML;
              }
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        });
      } catch (error) {
        console.log(error);
      }
    });
  };


  printBlog();

  const deleteBlog = async (element, id) => {
    try {
      if (id) {
        await deleteDoc(doc(db, "blogs", id));
      }
      element ? element.remove() : console.log("DE");
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  window.deleteBlog = deleteBlog;

  let cancelBtn = document.querySelector('#cancelBtn')
  cancelBtn && cancelBtn.addEventListener('click', () => {
    modal.style.display = ""
  })

  let editTitle = document.querySelector('#title-edit-inp')
  let editContent = document.querySelector('#content-edit-inp')
  let modal = document.querySelector('#modal')
  let blogID, blogElement;

  const editBlog = async (id, title, content, element) => {
    blogID = id
    blogElement = element
    editTitle.value = title
    editContent.value = content
    modal.style.display = "flex"
  };

  let updateBlog = async () => {
    updatingCon.style.display = "flex"
    updatingLoader.style.display = "flex"
    let newTitle = editTitle.value
    let newContent = editContent.value
    console.log("newTitle =>", newTitle, "newContent =>", newContent)
    const blogEditRef = doc(db, "blogs", blogID);
    await updateDoc(blogEditRef, {
      blogTitle: newTitle,
      blogCon: newContent,
    });
    deleteBlog(blogElement)
    blogID = ""
    blogElement = ""
    updatingCon.style.display = ""
    updatingLoader.style.display = ""
    modal.style.display = "none"
  }

  window.editBlog = editBlog;
  window.updateBlog = updateBlog;

  bannerPic &&
    bannerPic.addEventListener("mouseenter", () => {
      bannerPic.style.opacity = 0.6;
      changeBan.style.opacity = 1;
    });
  bannerPic &&
    bannerPic.addEventListener("mouseleave", () => {
      bannerPic.style.opacity = 1;
      changeBan.style.opacity = 0;
    });

  textA &&
    textA.addEventListener("mouseenter", () => {
      changeBan.style.opacity = 1;
      bannerPic.style.opacity = 0.6;
    });
  textA &&
    textA.addEventListener("mouseleave", () => {
      changeBan.style.opacity = 0;
      bannerPic.style.opacity = 1;
    });

  profilePic &&
    profilePic.addEventListener("mouseenter", () => {
      profilePic.style.opacity = 0.5;
      changePic.style.opacity = 1;
    });
  profilePic &&
    profilePic.addEventListener("mouseleave", () => {
      profilePic.style.opacity = 1;
      changePic.style.opacity = 0;
    });

  textP &&
    textP.addEventListener("mouseenter", () => {
      changePic.style.opacity = 1;
      profilePic.style.opacity = 0.5;
    });
  textP &&
    textP.addEventListener("mouseleave", () => {
      changePic.style.opacity = 0;
      profilePic.style.opacity = 1;
    });

  bannerBut &&
    bannerBut.addEventListener("change", () => {
      let banLoader = document.querySelector(".updating-con");
      let UID = localStorage.getItem("UID");
      bannerPic.src = URL.createObjectURL(bannerBut.files[0]);
      const storageRef = ref(storage, `images/${UID}/banner.png`);

      const uploadTask = uploadBytesResumable(storageRef, bannerBut.files[0]);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          switch (snapshot.state) {
            case "paused":
              break;
            case "running":
              banLoader.style.display = "flex";
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          try {
            getDownloadURL(uploadTask.snapshot.ref).then(async (imgURL) => {
              banLoader.style.display = "none";
              const washingtonRef = doc(db, "users", UID);
              await updateDoc(washingtonRef, {
                bannerImg: imgURL,
              });
            });
          } catch (error) {
            console.log(error);
          }
        }
      );
    });

  profileBut &&
    profileBut.addEventListener("change", () => {
      let picLoader = document.querySelector(".pic-loader");
      let UID = localStorage.getItem("UID");
      profilePic.src = URL.createObjectURL(profileBut.files[0]);
      const storageRef = ref(storage, `images/${UID}/profile-pic.png`);

      const uploadTask = uploadBytesResumable(storageRef, profileBut.files[0]);
      picLoader.style.display = "flex";
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          switch (snapshot.state) {
            case "paused":
              break;
            case "running":
              picLoader.style.display = "flex";
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          try {
            getDownloadURL(uploadTask.snapshot.ref).then(async (imgURL) => {
              picLoader.style.display = "none";
              const washingtonRef = doc(db, "users", UID);
              await updateDoc(washingtonRef, {
                profileImg: imgURL,
              });
            });
          } catch (error) {
            console.log(error);
          }
        }
      );
    });

  let changeAlbum = (albumNum) => {
    const picLoader = document.querySelector(`#albumLoader${albumNum}`);
    const albumBut = document.querySelector(`#album0${albumNum}`);
    const albumPic = document.querySelector(`#album${albumNum}-pic`);
    let albumId = albumPic.id;

    let UID = localStorage.getItem("UID");
    albumPic.src = URL.createObjectURL(albumBut.files[0]);
    console.log(albumPic.id);

    let albumButId = albumBut.id.trim();
    console.log(albumButId);

    const storageRef = ref(storage, `images/${UID}/albums/${albumButId}.png`);

    const uploadTask = uploadBytesResumable(storageRef, albumBut.files[0]);
    picLoader.style.display = "flex";
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case "paused":
            // console.log('Upload is paused');
            break;
          case "running":
            picLoader.style.display = "flex";
            // console.log('Upload is running');
            break;
        }
      },
      (error) => {
        console.log("Error:", error.code, error.message, error.serverResponse);
      },
      () => {
        try {
          getDownloadURL(uploadTask.snapshot.ref).then(async (imgURL) => {
            picLoader.style.display = "none";
            const washingtonRef = doc(db, "users", UID);
            let updateAlbum = {};

            if (albumId === "album1-pic") {
              updateAlbum = {};
              updateAlbum.album01 = imgURL;
            }
            if (albumId === "album2-pic") {
              updateAlbum = {};
              updateAlbum.album02 = imgURL;
            }
            if (albumId === "album3-pic") {
              updateAlbum = {};
              updateAlbum.album03 = imgURL;
            }

            await updateDoc(washingtonRef, updateAlbum);
          });
        } catch (error) {
          console.log(error);
        }
      }
    );
  };

  window.changeAlbum = changeAlbum;

  onAuthStateChanged(auth, async (user) => {
    let checkUID = localStorage.getItem("UID");
    if (user && checkUID) {
      const uid = user.uid;
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (
        location.pathname !== "/dashboard.html" &&
        location.pathname !== "/dashboard" &&
        location.pathname !== "/profile.html" &&
        location.pathname !== "/profile"
      ) {
        location.href = "/dashboard.html";
      }
      if (docSnap.exists()) {
        let data = docSnap.data();
        try {
          if (loader) {
            loader.style.display = "none"
          }
          if (profCon) {
            profCon.style.display = "flex";
          }
        } catch (error) {
          console.log(error);
        }
        try {
          if (data.bannerImg && bannerPic) {
            bannerPic.src = data.bannerImg;
          }
          if (data.profileImg && profilePic) {
            profilePic.src = data.profileImg;
          }
          if (topName) {
            topName.innerHTML = `${data.firstName} ${data.lastName}`;
          }

          profileName
            ? (profileName.innerHTML = `${data.firstName} ${data.lastName}`)
            : null;
          if (data.bio && profileBio) {
            profileBio.innerHTML = data.bio;
            profileBio.style.color = "";
            profileBio.style.cursor = "pointer";
            profileBio.style.color = "#fff";
          } else {
            if (profileBio) {
              profileBio.style.color = "#64a3fa";
              profileBio.style.cursor = "pointer";
              profileBio.innerHTML = "Add Bio";
            }
          }
          nameInp
            ? (nameInp.value = `${data.firstName} ${data.lastName}`)
            : null;
          bioInp ? (bioInp.value = data.bio) : null;
          emailInp ? (emailInp.value = data.gmail) : null;
          passwordInp ? (passwordInp.value = data.password) : null;
          if (data.album01 || data.album02 || data.album02) {
            album01Pic ? (album01Pic.src = data.album01) : null;
            album02Pic ? (album02Pic.src = data.album02) : null;
            album03Pic ? (album03Pic.src = data.album03) : null;
          } else {
            if (album01Pic && album02Pic && album03Pic) {
              album01Pic.src = "Images/user-icon.png";
              album02Pic.src = "Images/user-icon.png";
              album03Pic.src = "Images/user-icon.png";
            }
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log("No such document!");
      }
    } else {
      if (location.pathname !== "/index.html" && location.pathname !== "/register") {
        location.href = "/index.html"
      }
    }
  });

  profileBio &&
    profileBio.addEventListener("click", () => {
      editSetting.style.display = "flex";
      profileCon.style.opacity = 0.8;
      profileCon.style.pointerEvents = "none";
      updateBut.style.display = "block";
      cancelBut.style.display = "block";
      document.body.style.overflow = "hidden";
      bioInp.focus();
    });

  editProfile &&
    editProfile.addEventListener("click", () => {
      editSetting.style.display = "flex";
      profileCon.style.opacity = 0.8;
      profileCon.style.pointerEvents = "none";
      updateBut.style.display = "block";
      cancelBut.style.display = "block";
      document.body.style.overflow = "hidden";
    });

  updateBut &&
    updateBut.addEventListener("click", async () => {
      editSetting.style.display = "";
      profileCon.style.opacity = 1;
      profileCon.style.pointerEvents = "";
      updateBut.style.display = "";
      document.body.style.overflow = "";

      let newName = nameInp.value;
      let newBio = bioInp.value;
      let newEmail = emailInp.value;
      let newPass = passwordInp.value;

      console.log(emailInp.value);
      console.log(newName, newBio, newEmail, newPass);

      let uid = localStorage.getItem("UID");
      try {
        const docRef = doc(db, "users", uid);
        await updateDoc(docRef, {
          username: newName,
          bio: newBio,
          gmail: newEmail,
          password: newPass,
        });
      } catch (error) {
        console.log(error);
      }

      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        let data = docSnap.data();
        profileBio.innerHTML = data.bio;
        profileName.innerHTML = data.username;
      } else {
      }
    });

  cancelBut &&
    cancelBut.addEventListener("click", () => {
      editSetting.style.display = "";
      profileCon.style.opacity = 1;
      profileCon.style.pointerEvents = "";
      cancelBut.style.display = "";
      document.body.style.overflow = "";
    });
}

let editButtons = document.querySelector('#buttons')

if (hasParameter) {
  editButtons.style.visibility = "hidden";
  bannerBut.disabled = true
  profileBut.disabled = true
  album01.disabled = true
  album02.disabled = true
  album03.disabled = true
  const userRef = doc(db, "users", userParameter);
  const userData = await getDoc(userRef);
  const data = userData.data()
  if (loader) {
    loader.style.display = "none"
  }
  if (profCon) {
    profCon.style.display = "flex";
  }
  if (data.bannerImg && bannerPic) {
    bannerPic.src = data.bannerImg;
  }
  if (data.profileImg && profilePic) {
    profilePic.src = data.profileImg;
  }
  profileName
    ? (profileName.innerHTML = `${data.firstName} ${data.lastName}`)
    : null;
  console.log(data)
  if (data.bio && profileBio) {
    profileBio.innerHTML = data.bio;
  }
  if (data.album01 || data.album02 || data.album02) {
    album01Pic ? (album01Pic.src = data.album01) : null;
    album02Pic ? (album02Pic.src = data.album02) : null;
    album03Pic ? (album03Pic.src = data.album03) : null;
  } else {
    if (album01Pic && album02Pic && album03Pic) {
      album01Pic.src = "Images/user-icon.png";
      album02Pic.src = "Images/user-icon.png";
      album03Pic.src = "Images/user-icon.png";
    }
  }

  const q = query(collection(db, "blogs"), orderBy("timestamp", "asc"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    let blogData = doc.data()
    if (blogData.user.userID === userParameter) {
      let userProf = blogData.user.profileImg;
      let nameUser = `${blogData.user.firstName} ${blogData.user.lastName}`;

      let blogHTML = `
      <div class="blog">
        <div class="visit" style="display: none">
          <a href="profile.html?user="><i class="fa-solid fa-street-view"></i></a>
        </div>
    
        <div class="blog-title">
            <div>
                <img src="${blogData.user.profileImg ? userProf : 'Images/user-icon.png'}" alt="" id="blog-img">
            </div>

            <div>
                <div>
                    <h2 id="blog-title">${blogData.blogTitle}</h2>
                </div>

                <div class="blog-info">
                    <p id="blogUserName">${nameUser}</p>
                    <p>-</p>
                    <p id="blogTime">${blogData.timestamp.toDate().toLocaleString()}</p>
                </div>
            </div>
        </div>

        <div id="blog-content">${blogData.blogCon}</div>

        <div style="display: none">
            <button class="blog-but" id="blog-delete">Delete</button>
            <button class="blog-but" id="blog-edit">Edit</button>
        </div>
      </div>`;

      if (postingCon && postingLoader) {
        postingLoader.style.display = "none"
        postingCon.style.display = "none"
      }

      myBlogCon.innerHTML += blogHTML;
    }
  });
}



let registerBut = document.querySelector("#reg");
let loginBut = document.querySelector(".log-but");
let logoutBut = document.querySelector("#logout-but");

try {
  registerBut &&
    registerBut.addEventListener("click", async () => {
      console.log(firstName.value.length);
      if (firstName.value.length < 3 || firstName.value.length > 20) {
        Swal.fire(
          "Error",
          "First name must be between 3 and 20 characters.",
          "error"
        );
        return;
      } else if (lastName.value.length < 1 || lastName.value.length > 20) {
        Swal.fire(
          "Error",
          "Last name must be between 1 and 20 characters.",
          "error"
        );
        return;
      } else if (userPassword.value !== repPassword.value) {
        Swal.fire("Error", "Passwords do not match.", "error");
        return;
      } else if (
        userPassword.value.match(/^(?=\s*$)/g) ||
        firstName.value.match(/^(?=\s*$)/g) ||
        lastName.value.match(/^(?=\s*$)/g) ||
        userEmail.value.match(/^(?=\s*$)/g)
      ) {
        Swal.fire({
          icon: "error",
          text: "Enter Required Information",
        });
      } else {
        createUserWithEmailAndPassword(
          auth,
          userEmail.value,
          userPassword.value
        )
          .then(async (userCredential) => {
            try {
              const user = userCredential.user;
              await setDoc(doc(db, "users", user.uid), {
                firstName: firstName.value,
                lastName: lastName.value,
                gmail: userEmail.value,
                password: userPassword.value,
                userID: user.uid,
              });
              localStorage.setItem("UID", user.uid);
              let checkUID = localStorage.getItem("UID");
              if (checkUID) {
                window.location = "/dashboard.html";
              }
              console.log("CREATED");
            } catch (err) {
              console.log(err);
            }
          })
          .catch((error) => {
            // const errorCode = error.code;
            const errorMessage = error.message;
            Swal.fire({
              icon: "error",
              text: errorMessage,
            });
          });
      }
    });
} catch (error) {
  console.log(error);
}

loginBut &&
  loginBut.addEventListener("click", () => {
    if (
      userEmail.value.match(/^(?=\s*$)/g) ||
      userPassword.value.match(/^(?=\s*$)/g)
    ) {
      Swal.fire({
        icon: "error",
        text: "Enter Credentials",
      });
    } else {
      signInWithEmailAndPassword(auth, userEmail.value, userPassword.value)
        .then((userCredential) => {
          const user = userCredential.user;
          localStorage.setItem("UID", user.uid);
          let checkUID = localStorage.getItem("UID");
          if (checkUID) {
            window.location = "/dashboard.html";
          }
          console.log("LOGGED");
        })
        .catch((error) => {
          const errorMessage = error.message;
          userPassword.value = "";
          Swal.fire({
            icon: "error",
            text: errorMessage,
          });
        });
    }
  });

logoutBut &&
  logoutBut.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        localStorage.clear();
        // if(location.pathname !== "/index.html"){
        window.location = "index.html";
        // }
      })
      .catch((error) => {
        console.log(err);
      });
  });
