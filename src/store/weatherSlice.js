import { createSlice,createAsyncThunk, current } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchWeatherFromAPI } from '../services/weatherAPI'


export const fetchWeatherData = createAsyncThunk(
  "weather/fetchWeatherData",
  async(cityName, {rejectWithValue}) => {
    try {
      const data = await fetchWeatherFromAPI(cityName)
      return {
        cityName: cityName,
        data: data
      }
    } catch (error) {
      return rejectWithValue({
        message: 'Şehir bulunamadı ya da bağlantı hatası',
        cityName: cityName
      })
    }
  }
)


const weatherSlice=createSlice({
    name:'weather',
    initialState:{
        data:null,
        loading:false,
        error:null,
        currentCity:null,
    },
    //nrmal senkron actionlar(fronksiyonlar)
    reducers:{
        clearError:(state)=>{
            state.error=null
        },

        resetWeather:(state)=>{
            state.data=null
            state.currentCity=null
            state.error=null
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(fetchWeatherData.fulfilled,(state,action)=>{
            state.data=action.payload.data
            state.loading=false
            state.error=null
            state.currentCity=action.payload.cityName
        })


        builder.addCase(fetchWeatherData.pending,(state)=>{
            state.loading=true
            state.error=null
        })

         builder.addCase(fetchWeatherData.rejected,(state,action)=>{
            state.data=null
            state.loading=false
            state.error=action.payload
        })

        
    }
})


export const {clearError,resetWeather}=weatherSlice.actions
export default weatherSlice.reducer  //reducer ve extrareducer bilgileri strore için gerekli çünkü componentler erişecek 