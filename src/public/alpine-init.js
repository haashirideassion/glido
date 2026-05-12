/**
 * Alpine.js store registration.
 *
 * LOAD ORDER — this file MUST be loaded as a plain synchronous <script>
 * (no defer, no async) BEFORE the Alpine CDN <script defer> tag.
 * This guarantees our 'alpine:init' listener is registered before Alpine
 * fires the event during its own deferred execution.
 */
document.addEventListener('alpine:init', function () {
  window.Alpine.store('wizard', wizardStore())
  window.Alpine.store('kiosk', kioskStore())
})

function wizardStore() {
  return {
    currentStep: 1,
    totalSteps: 7,

    // Step 1
    slotCount: 1,
    guestName: '',
    guestPhone: '',

    // Step 2
    serviceType: null,   // 'pickup' | 'dropoff'

    // Step 3
    loadType: null,      // 'fcl' | 'lcl'

    // Step 4
    selectedDate: null,
    selectedSlotId: null,
    selectedSlotLabel: null,

    // Hold timer
    holdSecondsRemaining: 600,
    holdTimerInterval: null,

    // Step 5 — shipment details (fields vary by combo)
    houseBillNumber: '',
    containerNumber: '',
    // auto-populated (mock)
    shipmentData: null,   // { weightKg, volumeCbm, packageCount, palletCount, palletType, storageStartDate, storageCharge, shrinkWrapCharge, icsStatus }
    shipmentFetched: false,
    shipmentFetching: false,
    // drop-off fields
    cargoDescription: '',
    estimatedWeightKg: '',
    estimatedVolumeCbm: '',
    destinationPort: '',
    // always required
    driverName: '',
    driverPhone: '',

    // Step 6
    documents: [],

    // Step 7
    paymentMethod: 'card',   // 'card' | 'eft'
    eftConfirmed: false,
    termsAccepted: false,
    confirmationRef: null,

    get holdMinutes() {
      return String(Math.floor(this.holdSecondsRemaining / 60)).padStart(2, '0')
    },
    get holdSeconds() {
      return String(this.holdSecondsRemaining % 60).padStart(2, '0')
    },
    get holdExpiring() {
      return this.holdSecondsRemaining <= 120
    },
    get holdActive() {
      return this.holdSecondsRemaining < 600 && this.holdTimerInterval !== null
    },
    get isPickupLcl() { return this.serviceType === 'pickup' && this.loadType === 'lcl' },
    get isPickupFcl() { return this.serviceType === 'pickup' && this.loadType === 'fcl' },
    get isDropoffLcl() { return this.serviceType === 'dropoff' && this.loadType === 'lcl' },
    get isDropoffFcl() { return this.serviceType === 'dropoff' && this.loadType === 'fcl' },
    get showChepWarning() {
      return this.shipmentData && this.shipmentData.palletType === 'chep'
    },
    get showIcsHeld() {
      return this.shipmentData && this.shipmentData.icsStatus === 'held'
    },
    get storageChargeFormatted() {
      if (!this.shipmentData) return '$0.00'
      return '$' + (this.shipmentData.storageCharge || 0).toFixed(2)
    },
    get shrinkWrapFormatted() {
      if (!this.shipmentData) return '$0.00'
      return '$' + (this.shipmentData.shrinkWrapCharge || 0).toFixed(2)
    },
    get totalCharges() {
      if (!this.shipmentData) return 5.00
      return (this.shipmentData.storageCharge || 0) + (this.shipmentData.shrinkWrapCharge || 0) + 5.00
    },
    get totalWithGst() {
      return (this.totalCharges * 1.10).toFixed(2)
    },

    get canProceed() {
      switch (this.currentStep) {
        case 1: return this.slotCount >= 1 && this.guestName.trim().length >= 2
        case 2: return this.serviceType !== null
        case 3: return this.loadType !== null
        case 4: return this.selectedSlotId !== null
        case 5:
          if (this.serviceType === 'pickup') {
            if (this.loadType === 'lcl') return this.houseBillNumber.trim().length >= 6 && this.containerNumber.trim().length >= 4 && this.driverName.trim().length >= 2
            if (this.loadType === 'fcl') return this.containerNumber.trim().length >= 4 && this.driverName.trim().length >= 2
          }
          if (this.serviceType === 'dropoff') {
            return this.cargoDescription.trim().length >= 2 && this.driverName.trim().length >= 2
          }
          return false
        case 6: return true  // documents optional for some combos
        default: return false
      }
    },

    nextStep() {
      if (!this.canProceed && this.currentStep < 7) return
      if (this.currentStep === 4 && this.selectedSlotId) {
        this.startHoldTimer()
      }
      this.currentStep++
    },

    prevStep() {
      if (this.currentStep <= 1) return
      this.currentStep--
    },

    selectServiceType(type) { this.serviceType = type },
    selectLoadType(type) { this.loadType = type },

    selectSlot(slotId, label) {
      this.selectedSlotId = slotId
      this.selectedSlotLabel = label
    },

    startHoldTimer() {
      this.holdSecondsRemaining = 600
      clearInterval(this.holdTimerInterval)
      var self = this
      this.holdTimerInterval = setInterval(function () {
        self.holdSecondsRemaining--
        if (self.holdSecondsRemaining <= 0) {
          clearInterval(self.holdTimerInterval)
          self.holdTimerInterval = null
          self.selectedSlotId = null
          self.selectedSlotLabel = null
          self.currentStep = 4
          alert('Your slot hold has expired. Please select a new time slot.')
        }
      }, 1000)
    },

    // Mock shipment lookup
    fetchShipmentDetails() {
      if (!this.houseBillNumber.trim() && !this.containerNumber.trim()) return
      this.shipmentFetching = true
      this.shipmentFetched = false
      var self = this
      setTimeout(function () {
        self.shipmentFetching = false
        self.shipmentFetched = true
        self.shipmentData = {
          weightKg: 340,
          volumeCbm: 1.2,
          packageCount: 6,
          palletCount: 1,
          palletType: 'chep',
          storageStartDate: '21 Apr 2026',
          storageDays: 21,
          storageCharge: 252.00,
          shrinkWrapCharge: 10.00,
          icsStatus: 'cleared',
        }
      }, 1200)
    },

    // Mock FCL lookup
    fetchFclDetails() {
      if (!this.containerNumber.trim()) return
      this.shipmentFetching = true
      this.shipmentFetched = false
      var self = this
      setTimeout(function () {
        self.shipmentFetching = false
        self.shipmentFetched = true
        self.shipmentData = {
          weightKg: 18500,
          volumeCbm: 28.0,
          packageCount: 1,
          palletCount: 0,
          palletType: 'none',
          storageStartDate: null,
          storageDays: 0,
          storageCharge: 0,
          shrinkWrapCharge: 0,
          icsStatus: 'cleared',
        }
      }, 1200)
    },

    submitBooking() {
      var rand = String(Math.floor(Math.random() * 90000) + 10000)
      this.confirmationRef = 'GLD-2026-' + rand
      clearInterval(this.holdTimerInterval)
      this.holdTimerInterval = null
      this.currentStep = 8  // beyond 7 = success screen
    },

    reset() {
      clearInterval(this.holdTimerInterval)
      this.currentStep = 1
      this.slotCount = 1
      this.guestName = ''
      this.guestPhone = ''
      this.serviceType = null
      this.loadType = null
      this.selectedDate = null
      this.selectedSlotId = null
      this.selectedSlotLabel = null
      this.holdSecondsRemaining = 600
      this.holdTimerInterval = null
      this.houseBillNumber = ''
      this.containerNumber = ''
      this.shipmentData = null
      this.shipmentFetched = false
      this.shipmentFetching = false
      this.cargoDescription = ''
      this.estimatedWeightKg = ''
      this.estimatedVolumeCbm = ''
      this.destinationPort = ''
      this.driverName = ''
      this.driverPhone = ''
      this.documents = []
      this.paymentMethod = 'card'
      this.eftConfirmed = false
      this.termsAccepted = false
      this.confirmationRef = null
    },
  }
}

function kioskStore() {
  return {
    currentScreen: 'welcome',   // 'welcome' | 'lookup' | 'purpose' | 'idscan' | 'confirm' | 'walkin' | 'arrived' | 'screensaver'
    idleSeconds: 0,
    idleInterval: null,
    referenceInput: '',
    lookupResult: null,
    lookupError: false,
    licenceData: null,
    walkInPurpose: null,

    init() {
      var self = this

      function resetIdle() {
        self.idleSeconds = 0
      }

      document.addEventListener('mousemove', resetIdle)
      document.addEventListener('touchstart', resetIdle)
      document.addEventListener('keydown', resetIdle)
      document.addEventListener('click', resetIdle)

      self.idleInterval = setInterval(function () {
        if (self.currentScreen === 'welcome' || self.currentScreen === 'screensaver') return
        self.idleSeconds++
        if (self.idleSeconds >= 60) {
          self.goTo('screensaver')
          self.idleSeconds = 0
        }
      }, 1000)
    },

    goTo(screen) {
      this.currentScreen = screen
      this.idleSeconds = 0
    },

    wakeFromScreensaver() {
      if (this.currentScreen === 'screensaver') {
        this.goTo('welcome')
        this.referenceInput = ''
        this.lookupResult = null
        this.lookupError = false
        this.licenceData = null
        this.walkInPurpose = null
      }
    },

    startBookingLookup() { this.goTo('lookup') },
    startVisitingFlow() { this.goTo('purpose') },

    performLookup() {
      if (!this.referenceInput.trim()) return
      var ref = this.referenceInput.trim().toUpperCase()
      if (ref.startsWith('GLD-')) {
        this.lookupResult = {
          ref: ref,
          driverName: 'Carlos Mendez',
          slotTime: 'Today 08:00 – 09:00',
          serviceType: 'Pick Up',
          loadType: 'LCL',
          palletExchange: true,
          palletCount: 1,
        }
        this.lookupError = false
        this.goTo('idscan')
      } else {
        this.lookupError = true
        this.lookupResult = null
      }
    },

    confirmBooking() { this.goTo('idscan') },

    simulateScan() {
      this.licenceData = {
        name: 'Carlos Mendez',
        licenceNo: 'NSW8832145',
        dob: '12/06/1983',
        expiry: '12/06/2028',
        address: '18 Harbour St, Sydney NSW 2000',
        nameMatched: true,
      }
    },

    completeCheckIn() {
      this.goTo('arrived')
      var self = this
      var countdown = 5
      var timer = setInterval(function () {
        countdown--
        if (countdown <= 0) {
          clearInterval(timer)
          self.goTo('welcome')
          self.referenceInput = ''
          self.lookupResult = null
          self.licenceData = null
          self.walkInPurpose = null
        }
      }, 1000)
    },

    submitWalkIn() {
      this.goTo('arrived')
      var self = this
      setTimeout(function () {
        self.goTo('welcome')
        self.walkInPurpose = null
      }, 5000)
    },
  }
}
