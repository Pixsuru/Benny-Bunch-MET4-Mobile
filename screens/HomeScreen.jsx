import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  ActivityIndicator, 
  Image, 
  TouchableOpacity, 
  FlatList, 
  Dimensions,
  Animated,
  StatusBar 
} from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import MovieModal from "../components/MovieModelDetails";
import TrailerModal from "../components/TrailerModal"; 
import Svg, { Text as SvgText, Polygon } from "react-native-svg";
import { API_URL } from "../config";

const { width } = Dimensions.get('window');

const carouselMovies = [
  { title: 'KPop Demon Hunters', description: "When K-pop idols aren’t performing, they secretly fight supernatural threats.", image: 'https://image.tmdb.org/t/p/original/w3Bi0wygeFQctn6AqFTwhGNXRwL.jpg' },
  { title: 'Elio', description: 'Elio is pulled into a cosmic misadventure where he must connect with alien lifeforms.', image: 'https://image.tmdb.org/t/p/original/lWeaB9S77Os7VHOt8GH5JdfrBX3.jpg' },
  { title: 'Weapons', description: 'A class of children mysteriously vanish at the same time one night.', image: 'https://image.tmdb.org/t/p/original/vMGiCxW6biqLqdH77HtPbFDab0U.jpg' },
  { title: 'Demon Slayer (2025)', description: 'Tanjiro, Nezuko, and the Hashira face Upper Rank demons in the Infinity Castle.', image: 'https://image.tmdb.org/t/p/original/1RgPyOhN4DRs225BGTlHJqCudII.jpg' },
  { title: 'Ballerina', description: 'A Ruska Roma assassin begins her training during John Wick: Chapter 3.', image: 'https://image.tmdb.org/t/p/original/1yktYsxkmUtUFTUnCAUaqG6FEiz.jpg' },
  { title: 'Love Untangled ', description: 'A teen’s quest for love changes when a new transfer student arrives.', image: 'https://image.tmdb.org/t/p/original/el9PPlcttxRNEya1K7p4T3yIFOk.jpg' },
];

const trailers = [
  { title: 'The Map That Leads to You Trailer', url: 'https://www.youtube.com/watch?v=FK9BQm471c0', thumbnail: 'https://image.tmdb.org/t/p/original/9EMIndNTWofXf5a9e8WeyB8fDLD.jpg' },
  { title: 'Demon Slayer Trailer', url: 'https://www.youtube.com/watch?v=VQGCKyvzIM4', thumbnail: 'https://image.tmdb.org/t/p/original/tqMgCOiaNSRduOvjTO9kWZADHIr.jpg' },
  { title: 'Love Untangled Trailer', url: 'https://www.youtube.com/watch?v=0HwDE0HXbqc', thumbnail: 'https://image.tmdb.org/t/p/original/bS3RJmlkopcEMi07v6SbGOUplEO.jpg' },
  { title: 'KPop Demon Hunters Trailer', url: 'https://www.youtube.com/watch?v=AzCAwdp1uIQ', thumbnail: 'https://image.tmdb.org/t/p/original/uJ6Pk0362x37mZFVEcjk299U1Ju.jpg' },
  { title: 'The Naked Gun Trailer', url: 'https://www.youtube.com/watch?v=uLguU7WLreA', thumbnail: 'https://image.tmdb.org/t/p/original/j7S1XKl3SqCDNbUyFw65ln9u5Y8.jpg' },
  { title: 'Elio Trailer', url: 'https://www.youtube.com/watch?v=ETVi5_cnnaE', thumbnail: 'https://image.tmdb.org/t/p/original/7yzpHj2ssuwJERjj4y2MDoZDtRN.jpg' }
];

export default function HomeScreen({ navigation }) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieModalVisible, setMovieModalVisible] = useState(false);
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const [trailerModalVisible, setTrailerModalVisible] = useState(false);
  
  const [newReleases, setNewReleases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const carouselRef = useRef(null);
  const carouselInterval = useRef(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const renderLogo = () => (
      <View style={styles.logoContainer}>
        <Svg width="200" height="48" viewBox="0 0 320 80.64">
          <SvgText
            x="2.88"
            y="61.96"
            fill="#fff"
            fontSize="48"
            fontFamily="Noto Sans"
            fontWeight="700"
            fontStyle="italic"
          >
            AURA REELS
          </SvgText>
          <Polygon points="30 17.81 24.38 13.74 17.51 18.15 20.91 11.22 15.29 7.14 23.01 6.93 26.4 0 27.78 6.8 35.49 6.59 28.63 11.01 30 17.81" fill="#fff" />
          <Polygon points="52.55 17.81 46.93 13.74 40.07 18.15 43.46 11.22 37.84 7.14 45.56 6.93 48.95 0 50.33 6.8 58.05 6.59 51.18 11.01 52.55 17.81" fill="#fff" />
          <Polygon points="75.09 17.81 69.47 13.74 62.61 18.15 66 11.22 60.38 7.14 68.1 6.93 71.49 0 72.87 6.8 80.59 6.59 73.72 11.01 75.09 17.81" fill="#fff" />
          <Polygon points="96.21 17.81 90.59 13.74 83.73 18.15 87.12 11.22 81.5 7.14 89.22 6.93 92.61 0 93.99 6.8 101.71 6.59 94.84 11.01 96.21 17.81" fill="#fff" />
          <Polygon points="117.04 17.81 111.42 13.74 104.55 18.15 107.95 11.22 102.33 7.14 110.05 6.93 113.44 0 114.81 6.8 122.53 6.59 115.66 11.01 117.04 17.81" fill="#fff" />
        </Svg>
      </View>
    );

  const fetchNewReleases = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/movies`);
      if (!response.ok) throw new Error('Failed to fetch new releases.');
      const data = await response.json();
      const sorted = data.sort((a,b) => (a.createdAt && b.createdAt) ? new Date(b.createdAt) - new Date(a.createdAt) : 0);
      setNewReleases(sorted.slice(0,10));
    } catch (e) {
      console.error(e);
      setError('Could not load new releases.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();

    fetchNewReleases();
    startCarousel();
    return () => clearInterval(carouselInterval.current);
  }, []);

  const startCarousel = () => {
    carouselInterval.current = setInterval(() => {
      setCurrentSlideIndex(prev => {
        const nextIndex = (prev + 1) % carouselMovies.length;
        carouselRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        return nextIndex;
      });
    }, 7000);
  };

  const goToSlide = (index) => {
    clearInterval(carouselInterval.current);
    setCurrentSlideIndex(index);
    carouselRef.current?.scrollToIndex({ index, animated: true });
    startCarousel();
  };

  const openTrailerModal = (trailer) => {
    const match = trailer.url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?.*v=|(?:embed|v|shorts)\/))([^&?]+)/);
    const videoId = match ? match[1] : null;
    if(videoId) {
      setSelectedTrailer({ videoId });
      setTrailerModalVisible(true);
    } else alert('Invalid trailer URL.');
  };

  const getRating = (movie) => {
  if (movie.rating === undefined || movie.rating === null) return "0.0";
  return Number(movie.rating).toFixed(1);
};

  const getPoster = (movie) => movie.image || movie.poster || 'https://via.placeholder.com/140x200.png?text=No+Image';

  const renderMovieCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.movieCard} 
      onPress={()=>{ setSelectedMovie({...item, image:getPoster(item)}); setMovieModalVisible(true); }} 
      activeOpacity={0.8}
    >
      <Image source={{ uri: getPoster(item) }} style={styles.poster} />
      <LinearGradient colors={['transparent','rgba(0,0,0,0.9)']} style={styles.posterOverlay}>
        <View style={styles.movieInfo}>
          <Text style={styles.movieTitle} numberOfLines={1}>{item.title}</Text>
          <View style={styles.movieMeta}>
           <Text style={styles.movieRating}>⭐ {item.rating}</Text>


          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderHeroCarousel = () => (
    <View style={styles.heroSection}>
      <FlatList
        ref={carouselRef}
        data={carouselMovies}
        keyExtractor={(_, i) => `hero-${i}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.heroSlide}>
            <Image source={{ uri: item.image }} style={styles.heroImage} />
            <LinearGradient colors={['transparent','rgba(0,0,0,0.85)','rgba(0,0,0,0.95)']} style={styles.heroOverlay}>
              <View style={styles.heroContent}>
                <Text style={styles.heroTitle}>{item.title}</Text>
                <Text style={styles.heroDescription}>{item.description}</Text>
                <TouchableOpacity style={styles.browseButton} onPress={()=>navigation.navigate("CatalogueScreen")}>
                  <Text style={styles.browseButtonText}>Browse Catalog</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        )}
        onMomentumScrollEnd={event => {
          const newIndex = Math.floor(event.nativeEvent.contentOffset.x / width);
          setCurrentSlideIndex(newIndex);
          clearInterval(carouselInterval.current);
          startCarousel();
        }}
      />
      <View style={styles.carouselDots}>
        {carouselMovies.map((_, index) => (
          <TouchableOpacity key={index} style={[styles.dot, currentSlideIndex === index && styles.activeDot]} onPress={() => goToSlide(index)} />
        ))}
      </View>
    </View>
  );

  const renderTrailersSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>🎬 New Trailers</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:10}}>
        {trailers.map((trailer,index)=>(
          <TouchableOpacity key={index} style={styles.trailerCard} onPress={()=>openTrailerModal(trailer)}>
            <Image source={{uri: trailer.thumbnail}} style={styles.trailerThumbnail} />
            <Text style={styles.trailerTitle} numberOfLines={2}>{trailer.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderPerksSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>💎 Exclusive Perks</Text>
      <View style={styles.perksGrid}>
        <LinearGradient colors={['rgba(255,255,255,0.1)','rgba(255,255,255,0.05)']} style={styles.perkCard}>
          <Text style={styles.perkIcon}>🎬</Text>
          <Text style={styles.perkTitle}>Early Access</Text>
          <Text style={styles.perkText}>Watch new releases first.</Text>
        </LinearGradient>
        <LinearGradient colors={['rgba(255,255,255,0.1)','rgba(255,255,255,0.05)']} style={styles.perkCard}>
          <Text style={styles.perkIcon}>🍿</Text>
          <Text style={styles.perkTitle}>Discounted Rentals</Text>
          <Text style={styles.perkText}>Save up to 30%.</Text>
        </LinearGradient>
        <LinearGradient colors={['rgba(255,255,255,0.1)','rgba(255,255,255,0.05)']} style={styles.perkCard}>
          <Text style={styles.perkIcon}>⭐</Text>
          <Text style={styles.perkTitle}>VIP Events</Text>
          <Text style={styles.perkText}>Exclusive Q&A sessions.</Text>
        </LinearGradient>
        <LinearGradient colors={['rgba(255,255,255,0.1)','rgba(255,255,255,0.05)']} style={styles.perkCard}>
          <Text style={styles.perkIcon}>🚀</Text>
          <Text style={styles.perkTitle}>Unlimited Replays</Text>
          <Text style={styles.perkText}>Rewatch anytime.</Text>
        </LinearGradient>
      </View>
    </View>
  );

  const renderAboutSection = () => (
    <View style={styles.aboutSection}>
      <Text style={styles.aboutTitle}>About Aura Reels</Text>
      <Text style={styles.aboutText}>
        Aura Reels is your premier destination for cinematic entertainment. We provide curated releases, trailers, and perks for members. Dive into a world of storytelling with us.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#a64642", "#5a1f88", "#40224f", "#29183f"]} style={styles.background}>
        <ScrollView contentContainerStyle={{ paddingBottom: 50 }} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>{renderLogo()}</View>
          {renderHeroCarousel()}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🆕 New Releases</Text>
            {isLoading ? (
              <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
            ) : error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : (
              <FlatList
                horizontal
                data={newReleases}
                keyExtractor={(item) => item._id.toString()}
                renderItem={({ item }) => renderMovieCard({ item })}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingLeft: 20 }}
              />
            )}
          </View>

          {renderTrailersSection()}
          {renderPerksSection()}
          {renderAboutSection()}
        </ScrollView>
      </LinearGradient>

      <MovieModal visible={movieModalVisible} movie={selectedMovie} onClose={() => setMovieModalVisible(false)} />
      <TrailerModal visible={trailerModalVisible} videoId={selectedTrailer?.videoId} onClose={() => setTrailerModalVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1 },
  header: { alignItems: 'center', paddingTop: 50, paddingBottom: 20 },
  logoContainer: { alignItems: 'center', marginBottom: 10 },
  heroSection: { height: 400, width },
  heroSlide: { width, height: '100%' },
  heroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  heroOverlay: { position: 'absolute', bottom: 0, left:0, right:0, height: '70%', justifyContent:'flex-end', paddingBottom:30, paddingHorizontal:20 },
  heroContent: { alignItems:'flex-start' },
  heroTitle: { color:'#fff', fontSize:32, fontWeight:'bold', marginBottom:8 },
  heroDescription: { color:'rgba(255,255,255,0.8)', fontSize:14, marginBottom:15 },
  browseButton: { backgroundColor:'#ff6b6b', paddingHorizontal:24, paddingVertical:12, borderRadius:25 },
  browseButtonText: { color:'#fff', fontWeight:'bold', fontSize:16 },
  carouselDots: { flexDirection:'row', position:'absolute', bottom:10, left:0, right:0, justifyContent:'center' },
  dot: { width:8, height:8, borderRadius:4, backgroundColor:'rgba(255,255,255,0.4)', marginHorizontal:5 },
  activeDot: { backgroundColor:'#fff', width:12 },
  section: { marginTop:30, marginBottom:25 },
  sectionTitle: { textAlign:'center', fontSize:22, fontWeight:'bold', color:'#fff', marginBottom:15, marginLeft:20 },
  movieCard: { marginRight:15, width:140, position:'relative' },
  poster: { width:140, height:200, borderRadius:12, backgroundColor:'rgba(255,255,255,0.1)' },
  posterOverlay: { position:'absolute', bottom:0, left:0, right:0, height:'40%', borderBottomLeftRadius:12, borderBottomRightRadius:12, justifyContent:'flex-end' },
  movieInfo: { padding:10 },
  movieTitle: { color:'#fff', fontSize:14, fontWeight:'600', marginBottom:4 },
  movieMeta: { flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  movieRating: { color:'#ffd93d', fontSize:12 },
  trailerCard: { width:160, marginRight:15, borderRadius:12, overflow:'hidden' },
  trailerThumbnail: { width:'100%', height:90, backgroundColor:'rgba(255,255,255,0.1)' },
  trailerTitle: { color:'#fff', fontSize:14, fontWeight:'600', marginTop:8, paddingHorizontal:5 },
  perksGrid: { flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between', paddingHorizontal:20, gap:15 },
  perkCard: { width:(width-60)/2, borderRadius:15, padding:20, borderWidth:1, borderColor:'rgba(255,255,255,0.2)', alignItems:'center', marginBottom:15 },
  perkIcon: { fontSize:30, marginBottom:10 },
  perkTitle: { color:'#fff', fontSize:16, fontWeight:'bold', marginBottom:5 },
  perkText: { color:'rgba(255,255,255,0.8)', fontSize:12, textAlign:'center' },
  aboutSection: { padding:20, backgroundColor:'rgba(255,255,255,0.1)', borderRadius:15, marginHorizontal:20, marginBottom:30 },
  aboutTitle: { fontSize:20, fontWeight:'bold', color:'#fff', marginBottom:10, textAlign:'center' },
  aboutText: { color:'rgba(255,255,255,0.8)', fontSize:14, textAlign:'center', lineHeight:22 },
  errorText: { color:'#ff6b6b', fontSize:16, textAlign:'center', padding:20 }
});
