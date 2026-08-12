<div className='p-3 sm:p-4 lg:p-6 border rounded-2xl'>
  {/* Header — unchanged */}
  <div className=''>
    <div className='flex items-center gap-2 mb-1'>
      <h1 className='font-mono text-xl text-white font-semibold'>
        {booking?.status === 'confirmed'
          ? 'Booking Confirmed'
          : 'Booking Details'}
      </h1>
      {booking?.status === 'confirmed' && (
        <span className='text-emerald-400 text-lg'>✓</span>
      )}
    </div>
    <p className='font-mono text-xs text-white/40'>
      Booking Date: {booking?.created_at}
    </p>
    {isOnlineBooking && (
      <p className='font-mono text-xs text-white/40'>
        Razorpay Order ID: {booking?.razorpay_order_id}
      </p>
    )}
  </div>

  {/* Customer card — unchanged */}
  <div className='border border-[#28F1FF]/20 rounded-2xl p-5 mb-4 bg-gradient-to-b from-[#28F1FF]/5 to-transparent'>
    <p className='font-mono text-lg text-[#28F1FF]'>
      {booking?.customer_name ?? booking?.profiles?.full_name ?? 'Unknown'}
    </p>
    <p className='font-mono text-sm text-white/50 mt-1'>
      {booking?.customer_phone ??
        booking?.profiles?.phone ??
        'Contact info not provided'}
    </p>
    {booking?.profiles?.email && (
      <p className='font-mono text-xs text-white/40 mt-0.5'>
        {booking.profiles.email}
      </p>
    )}
  </div>

  {/* Status + Payment pills — add an extra pending-extension flag */}
  <div className='flex gap-3 mb-4 flex-wrap'>
    <span
      className={`font-mono text-xs px-4 py-1.5 rounded-full border ${statusStyles[booking?.status] ?? 'border-white/20 text-white/70'}`}
    >
      {booking?.status}
    </span>
    <span
      className={`font-mono text-xs px-4 py-1.5 rounded-full border ${paymentStyles[booking?.payment_status] ?? 'border-white/20 text-white/70'}`}
    >
      {booking?.payment_status}
      {booking?.payment_method && (
        <span className='text-white/40 ml-1'>· {booking.payment_method}</span>
      )}
    </span>
    {hasPendingExtension && (
      <span className='font-mono text-xs px-4 py-1.5 rounded-full border bg-orange-600/20 text-orange-300 border-orange-500/40'>
        Extension pending
      </span>
    )}
  </div>

  {/* QR block — unchanged */}
  {booking?.qr_code && (
    <div className='border border-white/10 rounded-2xl p-6 mb-4 flex flex-col items-center'>
      <p className='font-mono text-xs text-white/40 mb-4 uppercase tracking-wide'>
        Scan this QR code at venue
      </p>
      <div className='bg-white p-3 rounded-xl'>
        <QrCode size={140} className='text-black' />
      </div>
      <p className='font-mono text-xs text-white/40 mt-4'>Booking ID</p>
      <p className='font-mono text-sm text-white'>{booking?.id}</p>
    </div>
  )}

  {/* Booking details grid — duration now shows total including extensions */}
  <div className='grid grid-cols-2 gap-3 mb-4'>
    <DetailTile
      icon={<Monitor size={16} />}
      label='Device'
      value={booking?.device}
    />
    <DetailTile
      icon={<Calendar size={16} />}
      label='Date & Time'
      value={`${booking?.date} · ${booking?.start_time}`}
    />
    <DetailTile
      icon={<Clock size={16} />}
      label='Duration'
      value={formatDuration(totalDurationHours)}
    />
    <DetailTile
      icon={<Users size={16} />}
      label='Players'
      value={String(booking?.players)}
    />
  </div>

  {booking?.station_id && (
    <div className='mb-4 border border-white/10 rounded-2xl p-5'>
      <p className='font-mono text-xs text-white/40 mb-1'>Station</p>
      <p className='font-mono text-sm text-white'>{booking.station_id}</p>
    </div>
  )}

  {/* Bill summary — now itemizes extensions and shows a real total */}
  <div className='border border-white/10 rounded-2xl p-5 mb-4'>
    <p className='font-mono text-sm text-white mb-3 font-semibold'>
      Bill Summary
    </p>
    <div className='flex justify-between font-mono text-sm text-white/60 mb-2'>
      <span>Session charges</span>
      <span>₹{booking?.amount}</span>
    </div>

    {extensions.map((ext: any) => (
      <div
        key={ext.id}
        className='flex justify-between items-center font-mono text-sm text-white/60 mb-2'
      >
        <span>
          Extension ({ext.minutes} min)
          {ext.payment_status === 'pending' && (
            <span className='text-orange-400 ml-2'>· pending</span>
          )}
        </span>
        <div className='flex items-center gap-3'>
          <span>₹{ext.amount}</span>
          {/* {ext.payment_status === 'pending' && (
                <button
                  onClick={() =>
                    markExtensionPaid.mutate({
                      extensionId: ext.id,
                      markedPaidBy: user.id, // swap for actual staff user id
                    })
                  }
                  disabled={markExtensionPaid.isPending}
                  className='text-xs px-2 py-1 rounded-full border border-emerald-400/40 text-emerald-300 hover:border-emerald-400 transition-colors'
                >
                  {markExtensionPaid.isPending ? '...' : 'Mark Paid'}
                </button>
              )} */}
          {/* Only show per-line Mark Paid for online bookings.
          For cash/walk-in, the bottom button handles both together. */}
          {isOnlineBooking && ext.payment_status === 'pending' && (
            <button
              onClick={() =>
                markExtensionPaid.mutate({
                  bookingId: booking.id,
                  method: paymentMethod,
                })
              }
              disabled={markExtensionPaid.isPending}
            >
              {markExtensionPaid.isPending
                ? 'Processing...'
                : `Mark Paid ${booking.payment_method ?? 'cash'}`}
            </button>
          )}
        </div>
      </div>
    ))}

    <div className='border-t border-white/10 pt-3 flex justify-between font-mono text-sm text-white font-semibold'>
      <span>Total Amount</span>
      <span className='flex items-center gap-1'>
        <IndianRupee size={14} />
        {totalAmount}
      </span>
    </div>
  </div>

  {/* Payment details — unchanged */}
  {/* <div className='border border-white/10 rounded-2xl p-5 mb-6'>
        <p className='font-mono text-sm text-white mb-1 font-semibold'>
          Payment Details
        </p>
        <p className='font-mono text-xs text-white/40 mb-3'>
          Transaction ID: {booking?.transaction_id ?? '—'}
        </p>
        <div className='flex justify-between font-mono text-sm text-white/70'>
          <span>{booking?.payment_method ?? 'Wallet'}</span>
          <span>₹{booking?.amount}</span>
        </div>
      </div> */}
  <div className='mb-6 rounded-2xl border border-white/10 p-5'>
    <p className='mb-1 font-mono text-sm font-semibold text-white'>
      Payment Details
    </p>

    <p className='mb-4 font-mono text-xs text-white/40'>
      Transaction ID: {booking.transaction_id ?? '—'}
    </p>

    <div className='space-y-2 font-mono text-sm'>
      {/* Original booking */}
      <div className='flex justify-between text-white/70'>
        <span>Booking</span>
        <span>₹{Number(booking.amount ?? 0)}</span>
      </div>

      {/* Extensions */}
      {extensions.map((ext) => (
        <div key={ext.id} className='flex justify-between text-white/70'>
          <span>Extension · {ext.minutes} min</span>

          <span>₹{Number(ext.amount)}</span>
        </div>
      ))}

      <div className='my-3 border-t border-white/10' />

      <div className='flex justify-between font-semibold text-white'>
        <span>Total</span>
        <span>₹{totalAmount}</span>
      </div>

      {pendingAmount > 0 && (
        <div className='mt-3 flex justify-between rounded-lg border border-amber-400/20 bg-amber-400/5 px-3 py-2 text-amber-300'>
          <span>Amount due</span>
          <span>₹{pendingAmount}</span>
        </div>
      )}

      {pendingAmount === 0 && (
        <div className='mt-3 flex justify-between rounded-lg border border-green-400/20 bg-green-400/5 px-3 py-2 text-green-300'>
          <span>Payment status</span>
          <span>Paid</span>
        </div>
      )}
    </div>
  </div>

  {actions && <div className='flex gap-2 flex-wrap'>{actions}</div>}
</div>;
