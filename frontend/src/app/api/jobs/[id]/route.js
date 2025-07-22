import { NextResponse } from 'next/server';

// Mock data (replace with your real data source or database call)


export async function GET(request, { params }) {
    const { id } = params;
    const job = mockJobs.find(job => String(job._id) === id);
    if (job) {
        return NextResponse.json(job);
    } else {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
}