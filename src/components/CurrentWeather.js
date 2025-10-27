import React from 'react'
import { useSelector } from 'react-redux'

const CurrentWeather=()=> {

    const {data,currentCity}=useSelector((store)=>store.weather)
    

    if(!data?.current_condition?.[0] || !data?.weather?.[0]){
        return null
    }
    /*NULL SAFETY - Uygulama Patlamasını Önleme   belirsiz/kesin olamyan yerlerde kullan api ile ilgili

    data var mı yoksa sağ tarafa geçme undufiend dön varsa sağ tarafa bak 
    current_condition var mı varsa sağa geç [0] var mı yoksa undufiend dön
    data?.current_condition?.[0] hepsi varsa {obje} yi dön !{obje} obje oluğu için
    yani burası dolu true döner ünlem ile false olur ifin içine girmez
     */

    const current=data.current_condition[0]//şu anki hava durumu bilgileri için
    const today=data.weather[0]
    /*data.weather bir array (3 günlük veri)
    [0] = Bugün
    [1] = Yarın
    [2] = Öbür gün
    Neden: Bugünün max/min sıcaklık ve saatlik verilerini almak için */
    const hourlyData=today?.hourly || []  //İçeriği: 00:00, 03:00, 06:00... şeklinde 8 saatlik tahmin Neden: 3 saatlik tahminleri göstermek için
    //HOURLY GERÇEKTEN VAR MI kontrolü varsa objeyi dön yoksa boş liste

    //HOURLY DATA BOŞ OLABİLİR KONTROLÜ
    if (hourlyData.length === 0) {
    return (
      <div className="alert alert-danger">
        Hava durumu verileri eksik
      </div>
    )
  }


    const formatTime=(time)=>{  //apiden gelen saat bilgisini 12:00 gibi hae getirmek için
        const hour=time.toString().padStart(4,'0')//gelen saat bilgisini (örn:900) strige çevir ve 4 haneli hale getirene kadar baına 0 koy
        return `${hour.slice(0,2)}:${hour.slice(2)}`  //ilk 2 kısım : son iki kısım sonuç=12:00
    }

    const getWeatherDescription=(code)=>{//apiden gelen koda göre türkçe ifadesi gelecek kısacası bir sözlük oluşturduk
        const weatherCodes={
            113:'Güneşli',
            116:'Parçalı Bulutlu',
            119:'Bulutlu',
            122:'Çok Bulutlu',
            143:'Sisli',
            176:'Hafif Yağmur',
            179:'Hafif Kar',
            182:'Sağanak Yağmur',
            185:'Kar Yağışı',
            200:'Gök Gürültülü',
        }
        return weatherCodes[code] || 'Bilinmeyen'
    }

    const getWeatherIcon=(code)=>{
        const icons={
            113:'☀️',
            116:'🌥️',
            119:'☁️',
            122:'☁️',
            143:'🌫️',
            176:'🌦️',
            179:'🌨️',
            182:'🌧️',
            185:'❄️',
            200:'🌩️',
        }
        return icons[code] || '⛅'
    }
    
  const locationName=data?.nearest_area?.[0].areaName?.[0]?.value ?? 'Bilinmeyen'
  const countryName=data?.nearest_area?.[0]?.country?.[0]?.value ?? 'Bilinmeyen'
  /* ?? vs || farkı:
  const value1 = 0 || 'varsayılan'     // "varsayılan" (0 falsy sayılır)
const value2 = 0 ?? 'varsayılan'     // 0 (sadece null/undefined için varsayılan)

const value3 = null ?? 'varsayılan'  // "varsayılan"
const value4 = undefined ?? 'varsayılan'  // "varsayılan" 

*/


    return (
    <div className='card shadow mb-4'>
        <div className='card-header bg-primary text-white'>
            <h3 className='card-title mb-0'>
                <i className='bi bi-geo-alt-fill me-2'></i>
                {locationName}, {countryName}
            </h3>
            <small className='d-block mt-1' style={{fontSize: '0.85rem', opacity: 0.9}}>
                "{currentCity}" araması için sonuçlar
            </small>
        </div>
        <div className='card-body'>
            {/* ana sıcaklık ve durum bilgisi */}
            <div className='row align-items-center mb-4'>
                <div className='col-md-6 text-center'>
                    <div className='display-1 fw-bold text-primary mb-2'>
                        {current?.temp_C}°C
                    </div>
                    
                    <div className='fs-4 text-muted'>   
                        {getWeatherIcon(current?.weatherCode)} {getWeatherDescription(current?.weatherCode)}
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className='row g-3'>
                        <div className='col-6'>
                            <div className='card bg-light h-100'>
                                <div className='card-body text-center p-3'>
                                    <div className='fs-5 fw-bold text-primary'>
                                        {current?.FeelsLikeC}°C
                                    </div>
                                    <small className='text-muted'>Hissedilen Sıcaklık</small>
                                </div>
                            </div>
                        </div>

                        <div className='col-6'>
                            <div className='card bg-light h-100'>
                                <div className='card-body text-center p-3'>
                                    <div className='fs-5 fw-bold text-primary'>
                                        %{current?.humidity}
                                    </div>
                                    <small className='text-muted'>Nem</small>
                                </div>
                            </div>
                        </div>

                        <div className='col-6'>
                            <div className='card bg-light h-100'>
                                <div className='card-body text-center p-3'>
                                    <div className='fs-5 fw-bold text-primary'>
                                        {current?.windspeedKmph}km/h
                                    </div>
                                    <small className='text-muted'>Rüzgar</small>
                                </div>
                            </div>
                        </div>

                        <div className='col-6'>
                            <div className='card bg-light h-100'>
                                <div className='card-body text-center p-3'>
                                    <div className='fs-5 fw-bold text-primary'>
                                        {current?.uvIndex}
                                    </div>
                                    <small className='text-muted'>UV İndeksi</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
            <hr />
            {/*3 saatlik tahmin kısmı */}

            <h5 className='mb-3'>
                <i className='bi bi-clock me-2'></i>
                Bugünki 3 Saatlik Tahmin
            </h5>
            <div className='row g-3'>
                {hourlyData.map((hour,index)=>(
                    <div key={index} className='col-lg-3 col-md-4 col-6'>
                        <div className='card bg-light text-center h-100'>
                            <div className='card-body p-3'>
                                <div className='fw-bold text-primary mb-2'>
                                    {formatTime(hour?.time)} {/* api deki time verisi bu formnatlama gönderdik */}
                                </div>
                                <div className='fs-5 fw-bold mb-2'>
                                    {getWeatherIcon(hour?.weatherCode)}
                                </div>
                                <small className='text-muted d-block'>
                                    {getWeatherDescription(hour?.weatherCode)}
                                </small>

                                <div className='mt-2'>
                                    <small className='badge bg-info'>  {/*yağmur yağma ihtimali*/}
                                        <i className='bi bi-cloud-rain me-1'></i>
                                        %{hour?.chanceofrain}
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    </div>
  )
}

export default CurrentWeather