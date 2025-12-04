import { NextRequest, NextResponse } from 'next/server';
import { getOfficeManagerData } from '../../../../lib/services/officeManagerCache';
import { getUserByAddress, sendNotification } from '../../../../lib/services/neynarService';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { previousManagerAddress, newManagerAddress, pricePaid } = body;

        if (!previousManagerAddress || !newManagerAddress || !pricePaid) {
            return NextResponse.json(
                { error: 'Missing required fields: previousManagerAddress, newManagerAddress, pricePaid' },
                { status: 400 }
            );
        }

        // Skip if previous manager is the zero address
        if (previousManagerAddress === '0x0000000000000000000000000000000000000000') {
            return NextResponse.json({ success: true, message: 'No previous manager to notify' });
        }

        // Try to get FID from cache first
        let fid: number | undefined;
        const cachedData = getOfficeManagerData(previousManagerAddress);
        if (cachedData?.fid) {
            fid = cachedData.fid;
        } else {
            // Fallback: fetch from Neynar API
            const userData = await getUserByAddress(previousManagerAddress);
            if (userData?.fid) {
                fid = userData.fid;
            }
        }

        if (!fid) {
            return NextResponse.json(
                { success: false, message: 'Could not find FID for previous manager address' },
                { status: 404 }
            );
        }

        // Send notification
        const notificationTitle = 'Office Taken';
        const notificationBody = `Someone has taken the office! You received ${parseFloat(pricePaid).toFixed(4)} MON as the previous manager.`;
        const targetUrl = 'https://tavernkeeper.xyz/miniapp';

        const success = await sendNotification(
            [fid],
            notificationTitle,
            notificationBody,
            targetUrl
        );

        if (success) {
            return NextResponse.json({
                success: true,
                message: 'Notification sent successfully',
                fid,
            });
        } else {
            return NextResponse.json(
                { success: false, message: 'Failed to send notification' },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Error in notify-previous-manager route:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}
