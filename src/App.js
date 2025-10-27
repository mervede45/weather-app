import logo from './logo.svg';
import './App.css';
import react from 'react';
import { useSelector } from 'react-redux';
import CurrentWeather from './components/CurrentWeather'
import WeatherForecast from './components/WeatherForecast'
import WeaterSearch from './components/WeaterSearch'
import 'bootstrap/dist/css/bootstrap.min.css'
import ClotgingAdvice from './components/ClotgingAdvice';

function App() {

  const {loading,data} =useSelector((store)=>store.weather)

  //hava durumuna göre arka plan
  const getBackgroundStyle=()=>{
    if(!data?.current_condition?.[0]){
      return {
        backgroundImage:"url('https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=1920')",
        minHeight:'100vh'
      }
    }
    const weatherCode=data.current_condition[0]?.weatherCode || '113'
    const temp=parseInt(data.current_condition[0]?.temp_C || 0)

    const backgrounds={
      '113':'https://images.unsplash.com/photo-1601297183305-6df142704ea2?w=1920', // Güneşli
      '116': 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1920', // Parçalı bulutlu
      '119': 'https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?w=1920', // Bulutlu
      '122': 'https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?w=1920', // Çok bulutlu
      '143': 'https://images.unsplash.com/photo-1487621167305-5d248087c724?w=1920', // Sisli
      '176': 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=1920', // Hafif yağmur
      '179': 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=1920', // Kar
      '182': 'https://images.unsplash.com/photo-1518803194621-27188ba362c9?w=1920', // Sağanak
      '185': 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=1920', // Kar yağışı
      '200': 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=1920', // Gök gürültülü
    }
    const backgroundUrl=backgrounds[weatherCode] || backgrounds['113']
    return{
      backgroundImage:`linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${backgroundUrl})`,
      backgroundSize:'cover',
      backgroundPosition:'center',
      backgroundAttachment:'fixed', //kartlar resmin üstünden kaysın arka plan hep arkada sabit olsun
      minHeight:'100vh'

    }
  }
  return (
    <div style={getBackgroundStyle()}>
      <div className='d-flex align-items-center justify-content-center' style={{minHeight:"100vh"}}>
          <div className='container'> {/*bootstrapte containerın bir anlamı olduğu için yukrda ortalama divi açtık */}
            <div className='row justify-content-center'> 
                <div className='col-lg-10 col-xl-8'>
                    {/* ana başlık */}
                    <h1 className='text-center text-white mb-4 display-4 fw-bold mb-5'>
                        🌦️ SkyVibe
                    </h1>
                    {/* arama komponenti */}
                    <WeaterSearch />

                    {/*loading göstergesi */}
                    {loading && (
                      <div className='text-center py-5'>
                          <div className='spinner-border text-light mb-3' role="status">
                              <span className='visually-hidden'>Yükleniyor</span>{/*ekranda görünmez ancak ekran okuyucular okur */}
                          </div>
                          <p className='text-white fs-5'>Hava Durumu Verileri Yükleniyor...</p>
                      </div>
                    )}


                    {/*hava durumu komponentleri */}
                    {!loading && data &&(
                      <>
                        <CurrentWeather />
                        <ClotgingAdvice />
                        <WeatherForecast />

                      </>
                    )}
                </div>
            </div>
        </div>
      </div>
        
    </div>
  );
}

export default App;
