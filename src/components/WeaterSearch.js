import React, { useState,useEffect } from 'react'
import { fetchWeatherData,clearError, resetWeather } from '../store/weatherSlice'
import { useDispatch,useSelector } from 'react-redux'

const WeaterSearch=()=> {
    const [inputValue,setInputValue]=useState('')
    const dispatch=useDispatch()
    const {loading,error}=useSelector((store)=>store.weather)

    //URL PARAMETERS
    /*
        Olaylar Zinciri:
        1. Ali hava durumu uygulamasında İzmir'i aratıyor
        URL oluyor: http://localhost:3000/?city=Izmir

        2. Ali bu linki kopyalayıp Veli'ye WhatsApp'tan gönderiyor

        3. Veli linke tıklıyor

        4. Veli'nin tarayıcısı açılıyor: http://localhost:3000/?city=Izmir

    */
    //B)Sayfa yüklnediğinde url yi oku

    useEffect(()=>{ 
        const checkUrlAndFetch=()=>{
            const params=new URLSearchParams(window.location.search) //URL'deki parametreleri okumaya ve yönetmeye yarar.
            /*
                const params = new URLSearchParams(window.location.search)
                // window.location.search = "?city=Izmir"
                // params artık parametreleri okuyabilir
            
                const cityFromUrl = params.get('city')
                // cityFromUrl = "Izmir"
            */
             const cityFromUrl=params.get('city')
             //diğer temel kullanımlar
             /*
                params.get('city')
                params.set('city', 'istanbul')
                params.delete('city')
             */
             if(cityFromUrl){
                setInputValue(cityFromUrl)
                dispatch(fetchWeatherData(cityFromUrl))
            }else{ //ur de şehir yoksa ana sayfaya yönlendirir
                setInputValue('')
                dispatch(resetWeather())
            }
        }

        //Sayfa ilk açıldığında fonksiyonu bir kez çalıştıralım
        checkUrlAndFetch()

        //tarayıcıya ileri veya geri tuşuna basılırsa checkUrlAndFetch çalıştır diyelim

        window.addEventListener('popstate',checkUrlAndFetch)

        //component kapandığında dinleyiciyi temizle
        return()=>{ //performans ve bellek sızıntısı gibi durumlar içn kaldırıyoruz
            window.removeEventListener('popstate',checkUrlAndFetch)
        }
    },[dispatch])  //useeeffect içi,nde dışarıdan gelen her şeyi dependecy array içinde yazmalıyız 
    /*
        React şunu garanti eder: useState'den gelen setter fonksiyonları asla değişmez bu nedenle 
        dependecy array  içine setInputValue yazmadık 

        dispactte değişmez ancak Kod standartlarına uymka amacıyla yazdık
    */
    const handleSubmit=(event)=>{
        event.preventDefault()

        if(!inputValue.trim()){  //input dolu ise true boş ise false tır
            //trim inputa yazılan şeyin başındaki ve sonundaki boşlukları siler
            return  //eğer input boş gönderildiyse sonlandır
        }


        //URL PARAMETERS
        //A)Arama yapılnca url yi güncelleme
        const city=inputValue.trim()
        //sayfa yenilenmeden url yi güncelle
        const newUrl=`${window.location.pathname}?city=${encodeURIComponent(city)}`
        /*Nasıl Çalışıyor
            // Tam URL: http://localhost:3000/
            window.location.pathname  // "/"

            // Tam URL: http://localhost:3000/weather
            window.location.pathname  // "/weather"


            encodeURIComponent ise Türkçe karakterleri URL'e uygun hale getirir

         */

        window.history.pushState( //sayfa yenilenmeden url yi değiştiren komut
            {city},  //veri saklama state
            '',     //title (artık kullanılmıyor)
            newUrl  //yeni url

            /*
                 Tarayıcı window.location'ı günceller:       
            │     window.location.href = "http://localhost:3000/?city=hatay"   
            │     window.location.search = "?city=Ankara" 
            */
        )




        dispatch(clearError())  //eski hata mesajı ekranda kalmasın
        dispatch(fetchWeatherData(inputValue.trim()))
    }

    const handleInputChange=(event)=>{
        setInputValue(event.target.value);//inputa yazılan yeni değer artık şimdiki value muz oldu

        if(error){//kullanıcı hatalı bir şey girdi düzeltmek için tekrar inputa tıkladı ve eski hata mesajı silindi mantık bu
            dispatch(clearError())
        }
    }



  return (
    <div className='card shadow-sm mb-4'>
        <div className='card-body'>
            {/* hata mesajı varsa göstermek için burası */}
            {error &&(
                <div className='alert alert-danger d-flex align-items-center mb-3' role='alert'>
                    <i className='bi bi-exclamation-triangle-fill me-2'></i>
                    <div>
                        <strong>Hata</strong>
                        {error?.message}
                    </div>
                </div>
            )}

            {/* Arama Formu */}
            <form onSubmit={handleSubmit}>
                <div className='row g-3 d-flex align-items-center justify-content-center'>
                    <div className='col'>  {/* kalan alanı kapla */}
                        <div className='input-group'>
                            <span className='input-group-text'> {/* inputa eklenecek ek gruplar için */}
                                <i className='bi bi-geo-alt-fill text-primary'></i>
                            </span>
                            <input type="text" placeholder='Şehir adı girin (örn:Antalya,Hatay)' className='form-control form-control-lg' value={inputValue} onChange={handleInputChange}  disabled={loading}/>
                        </div>
                    </div>
                    <div className='col-auto'> {/* içerik kadar yer kapla */}
                        <button type='submit' className={`btn btn-lg ${loading ? 'btn-secondary':'btn-primary'}`} disabled={loading || !inputValue.trim()}> 
                            {loading ? (
                                <>
                                    <span className='spinner-border spinner-border-sm me-2' role="status"></span>
                                    Aranıyor...
                                </>
                            ):(
                                <>
                                    <i className='bi bi-search me-1'></i>
                                    Ara
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
  )
}

export default WeaterSearch