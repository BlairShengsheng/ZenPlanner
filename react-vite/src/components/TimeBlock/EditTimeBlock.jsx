//EditTimeBlock.jsx
import{ useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllTimeblocksThunk, editTimeblockThunk } from '../../redux/timeblocks';

//! --------------------------------------------------------------------
//*                          EditTimeBlock Component
//! --------------------------------------------------------------------

export const EditTimeBlock = () => {
  const { timeblockId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const timeblock = useSelector(state => state.timeblocks.singleTimeblock);


}
