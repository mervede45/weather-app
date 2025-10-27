import React, { use } from 'react'
import { useSelector } from 'react-redux'

const ClotgingAdvice=()=> {
    const {data} = useSelector((store)=>store.weather)
    if(!data?.current_condition?.[0] || !data?.weather?.[0]){
        return null
    }

    const current=data.current_condition[0]
    const today=data.weather[0]
    const temp=parseInt(current?.temp_C || 0)
    const windSpeed=parseInt(current?.windspeedKmph || 0)

    const hourlyData=today?.hourly || []
    let totalrain=0
    for(let hour of hourlyData){
        totalrain +=parseInt(hour?.chanceofrain || 0)
    }
    const rainChance=hourlyData.length > 0 ? Math.round(totalrain/hourlyData.length) : 0
    


    //ÇOK FAZLA İF YAPISINDAN KURTULMAK İÇİN OLUŞTURULDU
    const TEMPERATURE_CONFIG=[
        {
            max:10,
            clothes:["Kalın Mont","Kazak","Pantolon","Bot"],
            accessories:["Atkı","Eldiven","Bere"],
            message:"Hava soğuk kalın giyinin!"
        },

        {
            max:20,
            clothes:["Ceket","Uzun Kollu","Pantolon"],
            accessories:["Atkı","Bere"],
            message:"Hava serin,ceket almayı unutmayın."
        },

        {
            max:28,
            clothes:["Tişört","Hafif Pantolon veya Şort"],
            accessories:[],
            message:"Hava ılık,rahat giyinin."
        },

        {
            max:Infinity,
            clothes:["İnce Tişört","Şort","Elbise","Hafif Giysiler"],
            accessories:["Güneş gözlüğü","şapka"],
            message:"Hava sıcak,hafif şeyler giyin!"
        }
    ]


    const getClothingAdvice=()=>{
        let clothes=[]
        let accessories=[]

        const tempConfig=TEMPERATURE_CONFIG.find((config)=>temp < config.max )// uyuşan ilk şeyde durur

        if(tempConfig){
            clothes=[...tempConfig.clothes]
            accessories=[...tempConfig.accessories]
        }
        if(rainChance>50){
            accessories.push("Şemsiye","Yağmurluk")
        }

        if(windSpeed>20){
            accessories.push("Rüzgarlık")
        }
        const message=tempConfig?.message
        return {clothes,accessories,message}
    }

    const advice=getClothingAdvice()

    const getColorAdvice=()=>{
        if(temp>25) return "Açık renkli kıyafetler (beyaz,bej vs) tercih edin"
        if(temp<15) return "Koyu renkli kıyafetler tercih edin"
        return "Orta ton renkli kıyafetler tercih edin"
    }
  return (
    <div className='card shadow mb-4'>
        <div className='card-header bg-light text-dark'>
            <h3 className='card-title mb-0'>
                <i className='bi bi-bag me-2'></i>
                Giyim Önerileri
            </h3>
        </div>
        {/*sıcaklık durumu */}
        <div className='card-body'>
            <div className=''>
                <div className='alert alert-info mb-3'>
                    <strong>Hava {temp}°C </strong>
                    {advice.message}
                </div>
                {/*giysiler */}
                <h5 className='mb-3'>Önerilen Giysiler</h5>
                <div className='row g-2 mb-3'>
                    {advice.clothes.map((item,index)=>(
                        <div className='col-auto' key={index}>
                            <span className='badge bg-primary fs-6 p-2'>
                                {item}
                            </span>
                        </div>  
                    ))}
                </div>
                {/*aksesuarlar */}
                {advice.accessories.length>0 &&(
                    <>
                        <h5 className='mb-3'>Aksesuarlar</h5>
                        <div className='row g-2 mb-3'>
                            {advice.accessories.map((item,index)=>(
                                <div key={index} className='col-auto'>
                                    <span className='badge bg-secondary fs-6 p-2'>
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/*renk önerisi */}
                <div className='alert alert-light border'>
                    <i className='bi bi-palette me-2'></i>
                    {getColorAdvice()}
                </div>
                {/*özel uyarılar */}
                {rainChance >70 &&(
                    <div className='alert alert-warning'>
                        <i className='bi bi-cloud-rain me-2'></i>
                        Yağmur yağma ihtimali yüksek (ortalama %{rainChance},şemsiyenizi almayı unutmayın!)
                    </div>
                )}
                {windSpeed >30 &&(
                    <div className='alert alert-info'>
                        <i className='bi bi-wind me-2'></i>
                        Rüzgar kuvvetli,rüzgarlık giymeyi düşünün.
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}

export default ClotgingAdvice