import React from 'react'
import { useSelector } from 'react-redux'

const WeatherForecast=()=> {
    const {data}=useSelector((store)=>store.weather)

    if(!data?.weather || data.weather.length === 0){
        return null
    }

    const forecastDays=data.weather  //3 günlük veri içerir(bugün,yarın,sonrakigün)
    
    const formatDate=(dateString)=>{  //apiden gelen tarihi yarın bugün formatına çevirmek için 
        const date=new Date(dateString) //apiden gelen tarih  örn "date": "2025-09-25",
        const months=[
            'Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Eylül','Ekim','Kasım','Aralık'
        ]
        const day=date.getDate() //ayın kaçıncı günü bilgisi
        const month=date.getMonth()//kaçıncı ay bilgisi

        const today=new Date()//bugünün tarihi örn "Thu Sep 25 2025"
        const tomorrow=new Date(today)  //yarının tarihine şimdilik bugünün tarihi tanımlandı
        tomorrow.setDate(today.getDate()+1)//örneğin bugün 23 ü yarın 24 ü olacak
        const dayAfterTomorrow=new Date(today)
        dayAfterTomorrow.setDate(today.getDate()+2)

        if(date.toDateString()==today.toDateString()){
            return 'Bugün'
        }else if(date.toDateString()==tomorrow.toDateString()){
            return 'Yarın'
        }else if(date.toDateString()==dayAfterTomorrow.toDateString()){
            return 'Bir Sonraki Gün'
        }else{
            return `${day} ${month[months]}`
        }
    }

    const getDayName=(dateString)=>{
        const date=new Date(dateString)
        const days=['Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi','Pazar']
        return days[date.getDay()-1]//örn haftanın kaçıncı günü getDay() 2 döndürdü days[2] çalışır 
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
        return icons[code] || '🌤️'
    }
  return (
    <div className='card shadow mb-4'>
        <div className='card-header bg-success text-white'>
            <h3 className='card-title mb-0'>
                <i className='bi bi-calendar3 me-2'></i>
                3 Günlük Hava Durumu Tahmini
            </h3>
        </div>

        <div className='card-body'>
            <div className='row g-3'>
                {forecastDays.map((day,index)=>{
                    const hourlyData=day?.hourly || 0
                    const midDayWeather=hourlyData.find(h=>h?.time=='1200') || hourlyData[4] || {}
                    return(
                        <div key={index} className='col-12'>
                            <div className='card bg-light'>
                                <div className='card-body'>
                                    <div className='row align-items-center'>
                                        {/* sol kısımda tarih ve gün olacak */}
                                        <div className='col-md-3 text-center text-md-start mb-3 mb-md-0'>
                                            <div className='fw-bold fs-5 text-primary'>
                                                {formatDate(day?.date)}
                                            </div>
                                            <div className='text-muted'>
                                                {getDayName(day?.date)}
                                            </div>
                                        </div>
                                        {/*orta kısımda hava dureumu */}
                                        <div className='col-md-3 text-center mb-3 mb-md-0'>
                                            <div className='fs-1 mb-2'>
                                                {getWeatherIcon(midDayWeather?.weatherCode)}{/*günün hava durumunu en iyi yansıtacak saat öğle olduğu için  onun sembolü kullanılacak */}
                                            </div>
                                            
                                        </div>
                                        {/*sıcaklıklar */}
                                        <div className='col-md-3 text-center mb-3 mb-md-0'>
                                            <div className='row'>
                                                <div className='col-6'>
                                                    <div className='fs-4 fw-bold text-danger'>
                                                        {day?.maxtempC}°C
                                                    </div>
                                                    <small className='text-muted'>Maximum Sıcaklık</small>
                                                </div>
                                                <div className='col-6'>
                                                    <div className='fs-4 fw-bold text-primary'>
                                                        {day?.mintempC}°C
                                                    </div>
                                                    <small className='text-muted'>Minimum Sıcaklık</small>
                                                </div>
                                            </div>
                                        </div>
                                        {/*detaylar */}
                                        <div className='col-md-3'>
                                            <div className='row g-2'>
                                                <div className='col-4'>
                                                    <div className='text-center'>
                                                        <div className='text-primary fw-bold'>
                                                            %{midDayWeather?.chanceofrain}
                                                        </div>
                                                        <small className='text-muted'>
                                                            <i className='bi bi-cloud-rain'></i>
                                                        </small>
                                                    </div>
                                                </div>
                                                <div className='col-4'>
                                                    <div className='text-center'>
                                                        <div className='text-primary fw-bold'>
                                                            {midDayWeather?.windspeedKmph}kmh
                                                        </div>
                                                        <small className='text-muted'>
                                                            <i className='bi bi-wind'></i>
                                                        </small>
                                                    </div>
                                                </div>
                                                <div className='col-4'>
                                                    <div className='text-center'>
                                                        <div className='text-primary fw-bold'>
                                                            %{midDayWeather?.humidity}
                                                        </div>
                                                        <small className='text-muted'>
                                                            <i className='bi bi-droplet'></i>
                                                        </small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            {/* güneş doğuş batış bilgileri */}
            {forecastDays[0]?.astronomy?.[0] &&(
                <div className='row mt-4'>
                    <div className='col-12'>
                        <div className='card bg-warning bg-opacity-10'>
                            <div className='card-body'>
                                <h6 className='card-title text-warning'>
                                    <i className='bi bi-sun me-2'></i>
                                    Bugünün Astronomi Bilgileri
                                </h6>
                                <div className='row text-center'>
                                    <div className='col-md-3 col-6 mb-3'>
                                        <div className='fs-2'>
                                            🌅
                                        </div>
                                        <div className='fw-bold'>
                                            {forecastDays[0].astronomy[0]?.sunrise}
                                        </div>
                                        <small className='text-muted'>Gündoğumu</small>
                                    </div>
                                    <div className='col-md-3 col-6 mb-3'>
                                        <div className='fs-2'>
                                            🌇
                                        </div>
                                        <div className='fw-bold'>
                                            {forecastDays[0].astronomy[0]?.sunset}
                                        </div>
                                        <small className='text-muted'>Günbatımı</small>
                                    </div>

                                    <div className='col-md-3 col-6 mb-3'>
                                        <div className='f2-2'>
                                            🌙
                                        </div>
                                        <div className='fw-bold'>
                                            {forecastDays[0].astronomy[0]?.moon_phase}
                                        </div>
                                        <small className='text-muted'>Ay Evresi</small>
                                    </div>

                                    <div className='col-md-3 col-6 mb-3'>
                                        <div className='f2-2'>
                                            🌕
                                        </div>
                                        <div className='fw-bold'>
                                            {forecastDays[0].astronomy[0]?.moon_illumination}
                                        </div>
                                        <small className='text-muted'>Ay Işığı</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  )
}

export default WeatherForecast