@props(['url'])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
@if (trim($slot) === 'Greycode Shop')
<img src="{{ asset('images/Greycode_G_Logo_black.png') }}" class="logo" alt="Greycode Logo">
@else
{!! $slot !!}
@endif
</a>
</td>
</tr>
