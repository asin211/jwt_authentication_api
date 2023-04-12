const express = require('express')
const router = express.Router()

// JWT Web Token
const { authenticate_token } = require('../authentication/jwt_token')

const Track = require('../models/tracks')

// Get All Tracks
router.get('/tracks', authenticate_token, async (req, res) => {
    const tracks = await Track.find();
    res.json(tracks)
})

// Get Tracks by Id & Delete Track by Id - Chaining & // Update Track with Id
router.route('/tracks/:id')
    .get(authenticate_token, async (req, res) => {
        const track = await Track.findById(req.params.id);
        res.json(track)
    })
    .delete(authenticate_token, async (req, res) => {
        try {
            const track = await Track.findById(req.params.id);
            if (!track) {
                return res.status(404).send("Track not found");
            }
            await track.deleteOne();
            const tracks = await Track.find();
            res.json(tracks);
        } catch (err) {
            console.error(err);
            res.status(500).send(err.message);
        }
    })
    .put(authenticate_token, async (req, res) => {
        try {
            const track = await Track.findById(req.params.id);
            if (!track) {
                return res.status(404).send("Track not found");
            }

            // Update Track 
            track.title = req.body.title || track.title;
            track.artist = req.body.artist ? req.body.artist : track.artist;
            track.category = req.body.category ? req.body.category : track.category;
            track.thumbnail = req.body.thumbnail || track.thumbnail;
            track.release_year = req.body.release_year || track.release_year;
            track.duration = req.body.duration || track.duration;
            track.likes = req.body.likes || track.likes;
            track.uri = req.body.uri || track.uri;

            await track.save();
            res.json(track);
        } catch (err) {
            res.status(500).send(err.message);
        }
    })

// Get All Tracks by Artist Name
router.get('/tracks/artist/:name', authenticate_token, async (req, res) => {
    const tracks = await Track.find({ artist: { $in: [new RegExp(req.params.name, 'i')] } });
    res.json(tracks);
});

// Get Track by Title
router.get('/tracks/title/:title', authenticate_token, async (req, res) => {
    const track = await Track.find({ title: new RegExp(req.params.title, 'i') });
    res.json(track);
});

// Add Track
router.post('/tracks/add', authenticate_token, async (req, res) => {
    try {
        // Validate user input
        if ((!req.body.title || !req.body.category || !req.body.artist)) {
            return res.status(400).send("All input is required");
        }

        // Create New Track
        const track = new Track({
            title: req.body.title,
            artist: req.body.artist,
            category: req.body.category,

            thumbnail: req.body.thumbnail,
            release_year: req.body.release_year,
            duration: req.body.duration,
            likes: req.body.likes,
            uri: req.body.uri
        })

        // Save & Return New track
        track.save().then(() => {
            return res.status(201).json(track);
        })
    } catch (err) {
        res.send(err.message)
        res.status(500).send(err.message)
    }
})

module.exports = router