var setSong = function (songNumber) {
    if (currentSoundFile) {
        currentSoundFile.stop();
    }
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    //#1
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        //#2
        formats: [ 'mp3' ],
        preload: true
    });
    setVolume(currentVolume); 
    // sets the volume based on the below function of the song to whatever the current Volume variable is set to, as of checkpoint 20 simply 80/100. 
  };

 var setVolume = function(volume) {
     if (currentSoundFile) {
         currentSoundFile.setVolume(volume);
     }
 };

// this function sets the checks to see if there is a current sound file, and then sets the volume // 

var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
};
    
var createSongRow = function(songNumber, songName, songLength) {
     var template = 
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
 
     var $row = $(template);
    
     var clickHandler = function() {
         var songNumber = parseInt($(this).attr('data-song-number'));
         
         if (currentlyPlayingSongNumber !== null) {
             var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
             currentlyPlayingCell.html(currentlyPlayingSongNumber);
         }
         if (currentlyPlayingSongNumber !== songNumber) {
             $(this).html(pauseButtonTemplate);
             setSong(songNumber);
             currentSoundFile.play();
             updatePlayerBarSong();
         } else if (currentlyPlayingSongNumber === songNumber) {
             
             if (currentSoundFile.isPaused()) {
                 // ^ if the current song is paused;
                 $(this).html(pauseButtonTemplate); 
                     // sets  to pause button icon on the main page Application
                 $('main-controls .play-pause').html(playerBarPauseButton); 
                     // sets controls floating player bar to pause / match the page application
                 currentSoundFile.play(); 
                     // plays the current song using Buzz's API 
             } else {
                  // ^^ if it is not paused 
                  $(this).html(playButtonTemplate) 
                     // sets to play button icon
                  $('main-controls .play-pause').html(playerBarPlayButton)
                     // sets controls on floating player bar to it's play button icon
                  currentSoundFile.pause(); 
                     // pauses the current sound file 
             } 
         }
     };
    
     var onHover = function(event){
         var songNumberCell = $(this).find('.song-item-number');
         var songNumber = parseInt(songNumberCell.attr('data-song-number'));
         
         if (songNumber !== currentlyPlayingSongNumber) {
             songNumberCell.html(playButtonTemplate);
             
         }
     };
         
     var offHover = function(event) {
         var songNumberCell = $(this).find('.song-item-number'); 
         var songNumber = parseInt(songNumberCell.attr('data-song-number'));
         
         if (songNumber !== currentlyPlayingSongNumber) {
             songNumberCell.html(songNumber);
         }
     };

    // #1
    $row.find('.song-item-number').click(clickHandler);
    //#2
    $row.hover(onHover, offHover);
    //#3
    return $row;
 };

  var setCurrentAlbum = function(album) {
     currentAlbum = album;
     //#1
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');
 
     // #2
     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);
 
     // #3
     $albumSongList.empty();
 
     // #4
     for (var i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i +1, album.songs[i].title, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);
     }
 };

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};

var nextSong = function() {
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex++;

    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }
    
    var lastSongNumber = currentlyPlayingSongNumber;
    
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updatePlayerBarSong();
    
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
    
};

var previousSong = function() {
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex--;

    if (currentSongIndex < 0 ) {
        currentSongIndex = currentAlbum.songs.length - 1
    }
    
    var lastSongNumber = currentlyPlayingSongNumber;
    
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updatePlayerBarSong();
    
    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
    
};

var updatePlayerBarSong = function() {
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
};

// Album button templates 
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
 var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

//Store state of playing songs (Global Variables)
var currentAlbum = null; 
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
 
$(document).ready(function() {
     setCurrentAlbum(albumPicasso);
     $previousButton.click(previousSong);
     $nextButton.click(nextSong);
 });