-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_eventId_fkey";

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("idEvent") ON DELETE CASCADE ON UPDATE CASCADE;
