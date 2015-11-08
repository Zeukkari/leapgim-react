#
# Feedback Controller
#
# Relies visual and auditory feedback to the user.
#

config = window.config

class FeedbackController
    constructor: ->
        console.log "Feedback control ready"

    audioNotification: (clip) ->
        audio = new Audio(clip)
        audio.play()

    visualNotification: (viewID, msg) ->
        # console.log "View model: ", window.viewModel
        # console.log "View ID: ", viewID
        window.viewModel[viewID] = msg
        window.main.setState window.viewModel

    time: (elapsed) =>
        @visualNotification 'timer', elapsed

    handVisible: (visible) ->
        @visualNotification 'handVisible', visible

    confidenceMeter: (confidence) ->
        adjustedConfidence = confidence * 100
        @visualNotification 'meter', adjustedConfidence


window.FeedbackController = FeedbackController
