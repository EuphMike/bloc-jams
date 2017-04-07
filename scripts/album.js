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
             var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
             currentlyPlayingCell.html(currentlyPlayingSongNumber);
         }
         if (currentlyPlayingSongNumber !== songNumber) {
             $(this).html(pauseButtonTemplate);
             currentlyPlayingSongNumber = songNumber;
             currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
             updatePlayerBarSong();
         } else if (currentlyPlayingSongNumber === songNumber) {
             $(this).html(playButtonTemplate);
             $('.main-controls .play-pause').html(playerBarPlayButton);
             currentlyPlayingSongNumber = null; 
             currentSongfromAlbum = null
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
         console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
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
    
    currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    updatePlayerBarSong();
    
    var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
    
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
    
    currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    updatePlayerBarSong();
    
    var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
    
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

//Store state of playing songs 
var currentAlbum = null; 
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null; 
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
 
$(document).ready(function() {
     setCurrentAlbum(albumPicasso);
     $previousButton.click(previousSong);
     $nextButton.click(nextSong);
 });