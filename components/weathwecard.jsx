import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';

const WeatherCard = ({ data }) => {
  if (!data) return null;

  return (
    <Card className='w-[30vw] mx-auto mt-4 shadow-xl rounded-2xl bg-orange-400 '>
      <CardHeader className='text-center'>
        <CardTitle className='text-2xl font-bold'>{data.city}</CardTitle>
        <p className='text-sm text-gray-500'>{data.country}</p>
      </CardHeader>
      <CardContent className='flex flex-col items-center gap-3'>
        <div className=' text-3xl font-bold '>{data.temp}°C</div>
        <Badge className='text-lg px-3 py-1'>{data.weather}</Badge>
        <div className='text-sm text-gray-600'>Wind: {data.wind}m/s</div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;