
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC7nY9g0RJAhMkOuNYnDgjcO6hWERIvbzI",
    authDomain: "retail-5151c.firebaseapp.com",
    databaseURL: "https://retail-5151c.firebaseio.com",
    projectId: "retail-5151c",
    storageBucket: "retail-5151c.appspot.com",
    messagingSenderId: "825561680917",
    appId: "1:825561680917:web:2371842f2e2c4210f4d21c",
    measurementId: "G-E9F75QEXNS"
  };

// Initialize Firebase
const app = Firebase.initializeApp(firebaseConfig);


export const db = app.database();



//import {db} from './src/config';

//componentDidMount() {
//    db.ref('/todos').on('value', querySnapShot => {
//      let data = querySnapShot.val() ? querySnapShot.val() : {};
//      let todoItems = {...data};
//      this.setState({
//        todos: todoItems,
//      });
//    });
//  }


//npm cache clean --force

//addNewTodo() {
//    db.ref('/todos').push({
//      done: false,
//      todoItem: this.state.presentToDo,
//    });
//    Alert.alert('Action!', 'A new To-do item was created');
//    this.setState({
//      presentToDo: '',
//    });
//  }


//clearTodos() {
//    db.ref('/todos').remove();
//  }

