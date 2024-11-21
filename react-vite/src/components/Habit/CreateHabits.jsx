import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createAHabitThunk, setAllHabitsThunk } from "../../redux/habits";

import { useNavigate } from "react-router-dom";

//! --------------------------------------------------------------------
//*                          CreateHabit Component
//! --------------------------------------------------------------------

//CreateHabits.jsx

export const CreateHabit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionUser =  useSelector(state => state.session.user)

  useEffect(() => {
    //Redirect if not logged in
    if(!sessionUser) {
      navigate('/login');
    }
  },[sessionUser, navigate]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  //Validation state
  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  //! -------------------------Handle Form Submit-------------------------
  useEffect(() => {
    dispatch(setAllHabitsThunk());

    return () => {
      setName("");
      setDescription("");
      setErrors({});
      setHasSubmitted(false);
    }
  },[dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);


    
  }















}
