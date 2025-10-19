export async function GET() {
  return Response.json({
    hasRazorpayKeyId: !!process.env.RAZORPAY_KEY_ID,
    hasRazorpayKeySecret: !!process.env.RAZORPAY_KEY_SECRET,
    message: "Environment variables check completed",
  })
}
