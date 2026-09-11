<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use App\Exports\ProductsExport;
use Maatwebsite\Excel\Facades\Excel;

class ProductController extends Controller
{
    public function index()
    {
        return response()->json(Product::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'description' => 'required',
            'image' => 'required|image'
        ]);

        $imageName = Str::random() . '.' . $request->image->getClientOriginalExtension();
        Storage::disk('public')->putFileAs('product/image', $request->image, $imageName);

        Product::create($request->post() + ['image' => $imageName]);

        return response()->json(['message' => 'Product Created Successfully']);
    }

    public function show(Product $product)
    {
        return response()->json($product);
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'title' => 'required',
            'description' => 'required',
            'image' => 'nullable|image'
        ]);

        $product->fill($request->post());

        if ($request->hasFile('image')) {
            if ($product->image) {
                Storage::disk('public')->delete('product/image/' . $product->image);
            }
            $imageName = Str::random() . '.' . $request->image->getClientOriginalExtension();
            Storage::disk('public')->putFileAs('product/image', $request->image, $imageName);
            $product->image = $imageName;
        }

        $product->save();

        return response()->json(['message' => 'Product Updated Successfully']);
    }

    public function destroy(Product $product)
    {
        if ($product->image) {
            Storage::disk('public')->delete('product/image/' . $product->image);
        }
        $product->delete();

        return response()->json(['message' => 'Product Deleted Successfully']);
    }

    public function exportExcel()
    {
        return Excel::download(new ProductsExport, 'inventory_report.xlsx');
    }
}
