import express from "express";
import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/", {
  dbName: 'DB_Final',
})
  .then(() => console.log("Database is connected."))
  .catch((e) => console.log(e));

const userSchema = new mongoose.Schema({
  name: {
    type : String,
    required : true,
  },
  phone: {
    type : String, 
    required : true,
  },
  address: {
    type : String,
    required : true,
  },
});

const User = mongoose.model('UserData', userSchema);

const app = express();

app.set("view engine", "ejs");
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 


app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { name, phone, address } = req.body;

    await User.create({ name, phone, address });
    res.redirect("/user");
});

app.get("/user", async (req, res) => {
    let data = await User.find();
    res.render('admin', { data: data });
});

app.get("/updateuser/:id", async (req, res) => {
  const { id } = req.params;
    const updateUser = await User.findOne({ _id: id });
    res.render('updateuser', { user: updateUser });
});

app.post("/replace/:id", async (req, res) => {
  const { name, phone, address } = req.body;
  const { id } = req.params;

    await User.findByIdAndUpdate(
      { _id: id },
      { name, phone, address },
      { new: true }
    );
    res.redirect('/user');
});

app.get("/delete/:id", async (req, res) => {
  const { id } = req.params;
    await User.findByIdAndDelete({ _id: id });
    res.redirect('/user');
});

const PORT = 2000;
app.listen(PORT, () => console.log('Server is working.'));
