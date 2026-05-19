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

/* ── Global keyboard navigation — Enter advances the wizard ── */
document.addEventListener('keydown', function (e) {
  if (e.key !== 'Enter') return
  var tag = document.activeElement ? document.activeElement.tagName : ''
  if (tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'BUTTON' || tag === 'A') return
  /* only fire if wizard is on-page and active */
  if (!window.Alpine) return
  var store = window.Alpine.store('wizard')
  if (!store) return
  if (store.currentStep >= 8) return
  if (store.canProceed) store.nextStep()
})

function wizardStore() {
  return {
    currentStep: 1,
    totalSteps: 7,
    stepDirection: 1,  /* 1 = forward, -1 = backward */

    // Step 1
    slotCount: 1,
    guestName: '',
    guestPhone: '',
    guestEmail: '',

    // Step 2
    serviceType: null,   // 'pickup' | 'dropoff'

    // Step 3
    loadType: null,      // 'fcl' | 'lcl'

    // Step 4 — date/slot selection
    selectedDate: null,
    selectedSlotId: null,
    selectedSlotLabel: null,
    slots: [],
    slotsLoading: false,

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
    // Tenant EFT bank details (loaded from /api/tenants/config)
    eftBankName: 'Commonwealth Bank',
    eftBsb: '062-000',
    eftAccountNumber: '12345678',
    eftAccountName: 'Sydney CFS Pty Ltd',

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
      this.stepDirection = 1
      this.currentStep++
    },

    prevStep() {
      if (this.currentStep <= 1) return
      this.stepDirection = -1
      this.currentStep--
    },

    selectServiceType(type) { this.serviceType = type },
    selectLoadType(type) { this.loadType = type },

    selectSlot(slotId, label) {
      this.selectedSlotId = slotId
      this.selectedSlotLabel = label
    },

    selectDate(date) {
      this.selectedDate = date
      this.selectedSlotId = null
      this.selectedSlotLabel = null
      this.fetchSlots(date)
    },

    fetchSlots(date) {
      if (!date) return
      this.slotsLoading = true
      this.slots = []
      var self = this
      fetch('/api/slots?date=' + date)
        .then(function (r) { return r.json() })
        .then(function (data) {
          self.slotsLoading = false
          self.slots = data.slots || []
        })
        .catch(function () {
          self.slotsLoading = false
          self.slots = []
        })
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

    fetchShipmentDetails() {
      if (!this.houseBillNumber.trim() && !this.containerNumber.trim()) return
      this.shipmentFetching = true
      this.shipmentFetched = false
      var self = this
      var body = JSON.stringify({ hbl: self.houseBillNumber.trim(), container: self.containerNumber.trim(), serviceType: self.serviceType, loadType: self.loadType, slotDate: self.selectedDate })
      fetch('/api/shipments/lookup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body })
        .then(function (r) { return r.json() })
        .then(function (data) {
          self.shipmentFetching = false
          self.shipmentFetched = true
          if (data.found) {
            self.shipmentData = data
          } else {
            self.shipmentData = { found: false, storageCharge: 0, shrinkWrapCharge: 0, slotFee: data.slotFee || 5, subtotal: data.slotFee || 5, gstAmount: (data.slotFee || 5) * 0.1, totalAmount: (data.slotFee || 5) * 1.1, icsStatus: 'unavailable' }
          }
        })
        .catch(function () {
          self.shipmentFetching = false
          self.shipmentFetched = true
          self.shipmentData = { found: false, storageCharge: 0, shrinkWrapCharge: 0, slotFee: 5, subtotal: 5, gstAmount: 0.5, totalAmount: 5.5, icsStatus: 'unavailable' }
        })
    },

    fetchFclDetails() {
      if (!this.containerNumber.trim()) return
      this.shipmentFetching = true
      this.shipmentFetched = false
      var self = this
      var body = JSON.stringify({ hbl: '', container: self.containerNumber.trim(), serviceType: self.serviceType, loadType: 'fcl', slotDate: self.selectedDate })
      fetch('/api/shipments/lookup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body })
        .then(function (r) { return r.json() })
        .then(function (data) {
          self.shipmentFetching = false
          self.shipmentFetched = true
          self.shipmentData = data.found ? data : { found: false, storageCharge: 0, shrinkWrapCharge: 0, slotFee: data.slotFee || 5, subtotal: data.slotFee || 5, gstAmount: (data.slotFee || 5) * 0.1, totalAmount: (data.slotFee || 5) * 1.1, icsStatus: 'unavailable' }
        })
        .catch(function () {
          self.shipmentFetching = false
          self.shipmentFetched = true
          self.shipmentData = { found: false, storageCharge: 0, shrinkWrapCharge: 0, slotFee: 5, subtotal: 5, gstAmount: 0.5, totalAmount: 5.5, icsStatus: 'unavailable' }
        })
    },

    submitBooking() {
      clearInterval(this.holdTimerInterval)
      this.holdTimerInterval = null
      var form = document.createElement('form')
      form.method = 'POST'
      form.action = '/bookings'
      var fields = {
        serviceType: this.serviceType,
        loadType: this.loadType,
        slotDate: this.selectedDate,
        slotStartTime: this.selectedSlotLabel ? this.selectedSlotLabel.split(' – ')[0] : '',
        slotEndTime: this.selectedSlotLabel ? this.selectedSlotLabel.split(' – ')[1] : '',
        driverName: this.driverName,
        driverPhone: this.driverPhone,
        guestName: this.guestName,
        guestPhone: this.guestPhone,
        guestEmail: this.guestEmail,
        houseBillNumber: this.houseBillNumber,
        containerNumber: this.containerNumber,
        weightKg: this.shipmentData ? (this.shipmentData.weightKg || '') : '',
        volumeCbm: this.shipmentData ? (this.shipmentData.volumeCbm || '') : '',
        packageCount: this.shipmentData ? (this.shipmentData.packageCount || '') : '',
        palletCount: this.shipmentData ? (this.shipmentData.palletCount || '') : '',
        palletType: this.shipmentData ? (this.shipmentData.palletType || '') : '',
        storageStartDate: this.shipmentData ? (this.shipmentData.storageStartDate || '') : '',
        storageDays: this.shipmentData ? (this.shipmentData.storageDays || '') : '',
        storageCharge: this.shipmentData ? (this.shipmentData.storageCharge || '0') : '0',
        shrinkWrapCharge: this.shipmentData ? (this.shipmentData.shrinkWrapCharge || '0') : '0',
        slotFee: this.shipmentData ? (this.shipmentData.slotFee || '5') : '5',
        subtotal: this.shipmentData ? (this.shipmentData.subtotal || '5') : '5',
        gstAmount: this.shipmentData ? (this.shipmentData.gstAmount || '0.5') : '0.5',
        totalAmount: this.shipmentData ? (this.shipmentData.totalAmount || '5.5') : '5.5',
        paymentMethod: this.paymentMethod,
        paymentStatus: this.paymentMethod === 'eft' ? 'pending_eft' : 'pending',
      }
      for (var key in fields) {
        var input = document.createElement('input')
        input.type = 'hidden'
        input.name = key
        input.value = fields[key] !== null && fields[key] !== undefined ? String(fields[key]) : ''
        form.appendChild(input)
      }
      document.body.appendChild(form)
      form.submit()
    },

    reset() {
      clearInterval(this.holdTimerInterval)
      this.currentStep = 1
      this.slotCount = 1
      this.guestName = ''
      this.guestPhone = ''
      this.guestEmail = ''
      this.serviceType = null
      this.loadType = null
      this.selectedDate = null
      this.selectedSlotId = null
      this.selectedSlotLabel = null
      this.slots = []
      this.slotsLoading = false
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
      var self = this
      var ref = this.referenceInput.trim().toUpperCase()
      self.lookupError = false
      fetch('/kiosk/lookup/' + encodeURIComponent(ref))
        .then(function (r) { return r.json() })
        .then(function (data) {
          if (data.found) {
            self.lookupResult = data
            self.lookupError = false
            self.goTo('idscan')
          } else {
            self.lookupError = true
            self.lookupResult = null
          }
        })
        .catch(function () {
          self.lookupError = true
          self.lookupResult = null
        })
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
      var self = this
      var bookingId = self.lookupResult ? self.lookupResult.bookingId : null
      var licenceName   = self.licenceData ? self.licenceData.name         : ''
      var licenceNumber = self.licenceData ? self.licenceData.licenceNo    : ''
      var nameMatched   = self.licenceData ? self.licenceData.nameMatched  : false
      var nameMatchResult = nameMatched ? 'matched' : 'not_checked'

      // POST to server for real check-in
      if (bookingId) {
        fetch('/kiosk/checkin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookingId: bookingId, licenceName: licenceName, licenceNumber: licenceNumber, nameMatchResult: nameMatchResult }),
        }).catch(function (err) { console.warn('[kiosk] check-in POST failed:', err) })
      }

      self.goTo('arrived')
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
