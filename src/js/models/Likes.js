export default class Likes{
    constructor() {
        this.likes = [];
    }

    addLike(id,title, author,img){
        const like = {id ,title, author, img};
        this.likes.push(like);

        //perssit data in local storage
        this.persistData();

        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index,1);

        //perssit data in local storage
        this.persistData();

    }

    isLiked(id){
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes(){
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes))   // we can only save strings in this thus need to use stringify
        //stringify turns array to string

    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes')); // converts string to data structure
        
        // restore likes array from local storage
        if(storage) 
        this.likes = storage;
    }
}