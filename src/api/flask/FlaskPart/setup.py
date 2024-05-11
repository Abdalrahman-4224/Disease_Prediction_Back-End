from setuptools import setup, find_packages
from Cython.Build import cythonize
import glob

# Collect all .pyx files in the blueprints and modules directories
pyx_files = glob.glob('blueprints/*.pyx') + glob.glob('models/*.pyx')

setup(
    name="MyProject",
    packages=find_packages(),
    ext_modules=cythonize(pyx_files, compiler_directives={'language_level': "3"}),
    zip_safe=False,
)
